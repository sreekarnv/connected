import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Textarea,
	useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';
import useCreatePostMutation from '../hooks/useCreatePostMutation';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import useCroppedImage from '../../shared/hooks/useCropperImage';
import ImageCropper from '../../shared/components/ImageCropper';
import ImagePreview from '../../shared/components/ImagePreview';
import { ArrowUpIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import FeedLayout from '../layouts/FeedLayout';

const validationSchema = Yup.object()
	.shape({
		content: Yup.string().required('This is a required field').trim(),
	})
	.required();

interface CreatePostPageProps {}

const CreatePostPage: React.FC<CreatePostPageProps> = ({}) => {
	const { isLoading, mutate } = useCreatePostMutation();
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
			content: values.content,
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

			<FeedLayout>
				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<FormControl isRequired isInvalid={!!errors.content}>
						<FormLabel>Content</FormLabel>
						<Textarea rows={10} {...register('content')} />
						<FormErrorMessage>
							{errors.content?.message as string}
						</FormErrorMessage>
					</FormControl>

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
			</FeedLayout>
		</>
	);
};

export default CreatePostPage;
