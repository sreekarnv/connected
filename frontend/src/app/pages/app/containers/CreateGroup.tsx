import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';

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
	Heading,
	Text,
	Flex,
	IconButton,
} from '@chakra-ui/react';

import { UIContext } from '../../../store/context/UiContext';

import useCroppedImage from '../../../hooks/useCroppedImage';

import ImageCropper from '../../../components/ImageCropper/ImageCropper';
import TextAreaField from '../../../components/Form/TextAreaField';

import { ReactComponent as ImageIcon } from './../../../../assets/icons/image-inverted.svg';
import InputField from '../../../components/Form/InputField';
import axios from 'axios';
import { AuthContext } from '../../../store/context/AuthContext';

import useAlert from '../../../hooks/useAlert';
import BaseAlert from '../../../components/Alert/BaseAlert';

const initialValues = {
	name: '',
	description: '',
};

const createGroupSchema = Yup.object().shape({
	name: Yup.string().required('Group name cannot be empty!!'),
	description: Yup.string(),
});

const CreateGroup = () => {
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
	const { isCreateGroupOpen, onCreateGroupClose } = useContext(UIContext);
	const { userCreateNewGroup } = useContext(AuthContext);
	const history = useHistory();
	const { setAlert, isAlertOpen, alertDetails } = useAlert();

	useEffect(() => {
		if (!isCreateGroupOpen) {
			resetValues();
		}
	}, [isCreateGroupOpen, resetValues]);

	const onFormSubmit = async (values: {
		name: string;
		description?: string;
	}) => {
		const data = new FormData();
		data.append('name', values.name);

		if (image && imageSettings) {
			data.append('photo', image);
			data.append('imageSettings', JSON.stringify(imageSettings));
		}

		if (values.description && values.description.trim() !== '') {
			data.append('description', values.description);
		}

		try {
			const res = await axios({
				method: 'POST',
				url: '/api/v1/groups',
				data,
			});

			// globally update user groups
			userCreateNewGroup(res.data.group);

			history.push({
				pathname: `/app/groups/${res.data.group._id}/${res.data.group.slug}`,
			});

			onCreateGroupClose();
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
				isOpen={isCreateGroupOpen}
				scrollBehavior='inside'
				onClose={onCreateGroupClose}>
				<ModalOverlay />

				<ModalContent
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
							<Flex>
								<Heading color='primary.700' py={5}>
									Create Group
								</Heading>
								<IconButton aria-label='add members'></IconButton>
							</Flex>
						</ModalHeader>
						<ModalBody>
							<Formik
								initialValues={initialValues}
								validationSchema={createGroupSchema}
								onSubmit={(values: { name: string; description?: string }) => {
									onFormSubmit(values);
								}}>
								{({ isSubmitting }) => {
									return (
										<Form autoComplete='off'>
											<InputField name='name' label='Group Name' />

											<TextAreaField
												placeholder='Write here...'
												label='Group Description'
												name='description'
												color='gray.800'
												className='placeholder'
												required={false}
												bg='secondary.200'
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
													loading={isSubmitting}
													type='submit'
													colorScheme='green'
													mr={4}
													variant='solid'>
													Create Group
												</Button>
												<Button
													onClick={onCreateGroupClose}
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

export default CreateGroup;
