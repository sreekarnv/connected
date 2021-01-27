import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
	Box,
	Button,
	FormControl,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	FormLabel,
	Heading,
	Text,
} from '@chakra-ui/react';

import { UIContext } from '../../../store/context/UiContext';
import { AuthContext } from '../../../store/context/AuthContext';

import useCroppedImage from '../../../hooks/useCroppedImage';

import ImageCropper from '../../../components/ImageCropper/ImageCropper';
import TextAreaField from '../../../components/Form/TextAreaField';

import { ReactComponent as ImageIcon } from './../../../../assets/icons/image-inverted.svg';
import useAlert from '../../../hooks/useAlert';
import BaseAlert from '../../../components/Alert/BaseAlert';

const initialValues = {
	group: '',
	content: '',
};

const createPostSchema = Yup.object().shape({
	group: Yup.string(),
	content: Yup.string().required('content cannot be empty'),
});

const CreatePost = () => {
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

	const { onCreatePostClose, isCreatePostOpen } = useContext(UIContext);
	const { userGroups } = useContext(AuthContext);
	const { setAlert, isAlertOpen, alertDetails } = useAlert();
	const history = useHistory();

	useEffect(() => {
		if (!isCreatePostOpen) {
			resetValues();
		}
	}, [isCreatePostOpen, resetValues]);

	const onFormSubmit = async (values: { content: string; group?: string }) => {
		const data = new FormData();
		data.append('content', values.content);

		if (image && imageSettings) {
			data.append('photo', image);
			data.append('imageSettings', JSON.stringify(imageSettings));
		}

		if (values.group && values.group.trim() !== '') {
			data.append('group', values.group);
		}

		try {
			const res = await axios({
				method: 'POST',
				url: '/api/v1/posts',
				data,
			});

			onCreatePostClose();
			if (!res.data.post.isPublic) {
				return history.push({
					pathname: `/app/groups/${res.data.post.group._id}/${res.data.post.group.slug}`,
				});
			} else {
				return history.push({ pathname: '/app/public' });
			}
		} catch (err) {
			if (err.response) {
				let message = err.response.data.message;
				setAlert('error', message);
			}
		}
	};

	return (
		<>
			{isAlertOpen && <BaseAlert alertDetails={alertDetails} />}
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

			<Modal
				size='full'
				motionPreset='slideInBottom'
				isOpen={isCreatePostOpen}
				scrollBehavior='inside'
				onClose={onCreatePostClose}>
				<ModalOverlay />

				<ModalContent
					mb={0}
					className='hide-scrollbar'
					overflowY='scroll'
					minHeight='100vh'>
					<Box
						m={{
							lg: '0 300px',
							md: '0 100px',
							sm: '0',
						}}>
						<ModalCloseButton />
						<ModalHeader>
							<Heading color='primary.700' py={5}>
								Create Post
							</Heading>
						</ModalHeader>
						<ModalBody>
							<Formik
								initialValues={initialValues}
								validationSchema={createPostSchema}
								onSubmit={(values: { content: string; group?: string }) => {
									onFormSubmit(values);
								}}>
								{({ isSubmitting }) => {
									return (
										<Form autoComplete='off'>
											<FormControl mb={5}>
												<FormLabel>Select Group</FormLabel>

												<Select
													name='group'
													id='group'
													as={Field}
													component='select'>
													<option value=''>Public</option>
													{userGroups &&
														userGroups.map((el: any) => {
															return (
																<option key={el._id} value={el._id}>
																	{el.name}
																</option>
															);
														})}
												</Select>
											</FormControl>

											<TextAreaField
												placeholder='Write here...'
												label='Content'
												color='gray.800'
												className='placeholder'
												name='content'
											/>

											<FormControl d='flex' alignItems='center'>
												<Button
													cursor='pointer'
													as='label'
													htmlFor='image-upload'
													mr={10}
													leftIcon={<Icon as={ImageIcon} />}>
													Image
												</Button>
												<input
													onChange={(e: any) => setImage(e.target.files[0])}
													type='file'
													name='image-upload'
													id='image-upload'
													style={{ display: 'none' }}
												/>
												<Text>{image && image.name}</Text>
											</FormControl>
											{croppedImage && (
												<Box mt={4} boxSize='200px'>
													<img src={croppedImage} alt='Something' />
												</Box>
											)}
											<ModalFooter>
												<Button
													isLoading={isSubmitting}
													type='submit'
													colorScheme='green'
													mr={4}
													variant='solid'>
													Post
												</Button>
												<Button
													onClick={onCreatePostClose}
													colorScheme='blue'
													mr={3}>
													Close
												</Button>
											</ModalFooter>
										</Form>
									);
								}}
							</Formik>
						</ModalBody>
					</Box>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
