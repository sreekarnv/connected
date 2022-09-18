import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Select,
	Textarea,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import useCreatePostMutation from '../hooks/useCreatePostMutation';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import useCroppedImage from '../../shared/hooks/useCropperImage';
import ImageCropper from '../../shared/components/ImageCropper';
import ImagePreview from '../../shared/components/ImagePreview';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { RQ } from '../../shared/types/react-query';
import { UserType } from '../../shared/types/api';

const validationSchema = Yup.object()
	.shape({
		content: Yup.string().required('This is a required field').trim(),
	})
	.required();

interface CreatePostPageProps {}

const CreatePostPage: React.FC<CreatePostPageProps> = ({}) => {
	const { isLoading, mutate } = useCreatePostMutation();
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
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

	const { colorMode } = useColorMode();

	const onSubmit = (values: FieldValues) => {
		mutate({
			content: values.content,
			group: values.group,
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
				<Heading mb='8'>Create Post</Heading>
				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<FormControl isRequired isInvalid={!!errors.content}>
						<FormLabel>Content</FormLabel>
						<Textarea 
							borderColor={colorMode === 'light' ? 'gray.300' : 'inherit'}
						
						rows={10} {...register('content')} />
						<FormErrorMessage>
							{errors.content?.message as string}
						</FormErrorMessage>
					</FormControl>

					<FormControl isRequired isInvalid={!!errors.content}>
						<Select
							borderColor={colorMode === 'light' ? 'gray.300' : 'inherit'}

							my='8'
							defaultValue={''}
							placeholder='Select option'
							{...register('group')}>
							<option value=''>None (Public Feed)</option>
							{user.groups?.map((group) => (
								<option key={group._id} value={group._id}>
									{group.name}
								</option>
							))}
						</Select>
						<FormErrorMessage>
							{errors.content?.message as string}
						</FormErrorMessage>
					</FormControl>

					<Flex justifyContent='space-between' alignItems='center' mt='4'>
						<Button
							backgroundColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
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

export default CreatePostPage;
