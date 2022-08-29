import React from 'react';
import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	Textarea,
	useDisclosure,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import useCroppedImage from '../../shared/hooks/useCropperImage';
import ImageCropper from '../../shared/components/ImageCropper';
import ImagePreview from '../../shared/components/ImagePreview';
import { ArrowUpIcon } from '@chakra-ui/icons';
import useCreateGroupMutation from '../hooks/useCreateGroupMutation';

interface CreateGroupPageProps {}

const validationSchema = Yup.object()
	.shape({
		name: Yup.string().required('This is a required field').trim(),
		description: Yup.string().required('This is a required field').trim(),
		groupType: Yup.string().required('This is a required field').trim(),
	})
	.required();

const CreateGroupPage: React.FC<CreateGroupPageProps> = ({}) => {
	const { isLoading, mutate } = useCreateGroupMutation();
	const {
		image,
		setImage,
		showImageCropper,
		closeImageCropper,
		imageSettings,
		setImageSettings,
		imageUrl,
		setCroppedImage,
		croppedImage,
		resetValues,
	} = useCroppedImage();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = (values: FieldValues) => {
		mutate({
			name: values.name,
			description: values.description,
			groupType: values.groupType,
			imageSettings: JSON.stringify(imageSettings),
			photo: image,
		});
		reset();
		resetValues();
	};

	return (
		<>
			{image && imageUrl && (
				<ImageCropper
					showImageCropper={showImageCropper}
					closeImageCropper={closeImageCropper}
					imageSettings={imageSettings}
					setImageSettings={setImageSettings}
					photo={imageUrl}
					setCroppedImage={setCroppedImage}
				/>
			)}

			{croppedImage && (
				<ImagePreview
					imageUrl={croppedImage}
					isOpen={isOpen}
					onClose={onClose}
				/>
			)}

			<>
				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<FormControl isRequired isInvalid={!!errors.name} mb='5'>
						<FormLabel>Group Name</FormLabel>
						<Input {...register('name')} />
						<FormErrorMessage>
							{errors.name?.message as string}
						</FormErrorMessage>
					</FormControl>

					<FormControl isRequired isInvalid={!!errors.description} mb='5'>
						<FormLabel>Group Description</FormLabel>
						<Textarea rows={10} {...register('description')} />
						<FormErrorMessage>
							{errors.description?.message as string}
						</FormErrorMessage>
					</FormControl>

					<Select
						defaultValue={'public'}
						placeholder='Select option'
						{...register('groupType')}>
						<option value='public'>Public</option>
						<option value='private'>Private</option>
					</Select>

					<Flex justifyContent='space-between' alignItems='center' mt='4'>
						<Button
							cursor='pointer'
							leftIcon={<ArrowUpIcon />}
							as='label'
							htmlFor='photo'
							size='sm'>
							Add Image
						</Button>

						<input
							style={{ display: 'none' }}
							type='file'
							name='photo'
							id='photo'
							onChange={(e: any) => setImage(e.target.files[0])}
						/>

						<Box role='button' onClick={() => onOpen()}>
							{croppedImage && <Avatar size={'sm'} src={croppedImage} />}
						</Box>
					</Flex>

					<Button isLoading={isLoading} colorScheme='blue' mt='4' type='submit'>
						Submit
					</Button>
				</form>
			</>
		</>
	);
};

export default CreateGroupPage;
