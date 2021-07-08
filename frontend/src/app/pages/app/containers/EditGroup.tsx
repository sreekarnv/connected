import React, { useContext, useEffect } from 'react';
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
} from '@chakra-ui/react';

import useCroppedImage from '../../../hooks/useCroppedImage';

import ImageCropper from '../../../components/ImageCropper/ImageCropper';
import TextAreaField from '../../../components/Form/TextAreaField';

import { ReactComponent as ImageIcon } from './../../../../assets/icons/image-inverted.svg';
import InputField from '../../../components/Form/InputField';

import { AuthContext } from '../../../store/context/AuthContext';

import useAlert from '../../../hooks/useAlert';
import BaseAlert from '../../../components/Alert/BaseAlert';
import { Group as GroupType } from '../../../config/types';
import axios from '../../../config/axios';

const createGroupSchema = Yup.object().shape({
	name: Yup.string().required('Group name cannot be empty!!'),
	description: Yup.string(),
});

interface Props {
	group: GroupType;
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	setGroup: React.Dispatch<React.SetStateAction<GroupType | null>>;
}

const EditGroup: React.FC<Props> = ({
	group,
	isOpen,
	onClose,
	onOpen,
	setGroup,
	...props
}) => {
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
	const initialValues = {
		name: group.name,
		description: group.description ? group.description : '',
	};

	const { userUpdateGroup } = useContext(AuthContext);
	const { setAlert, isAlertOpen, alertDetails } = useAlert();

	useEffect(() => {
		if (!isOpen) {
			resetValues();
		}
	}, [isOpen, resetValues]);

	useEffect(() => {
		if (group) {
			setCroppedImage(group.photo);
		}
	}, [group, setCroppedImage]);

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
				method: 'PATCH',
				url: `/api/v1/groups/${group._id}`,
				data,
			});

			onClose();
			userUpdateGroup(res.data.group);
			setGroup(res.data.group);
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
				isOpen={isOpen}
				scrollBehavior='inside'
				onClose={onClose}>
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
									Update Group
								</Heading>
							</Flex>
						</ModalHeader>
						<ModalBody>
							<Formik
								initialValues={initialValues}
								validationSchema={createGroupSchema}
								onSubmit={(
									values: { name: string; description?: string },
									{ setSubmitting }
								) => {
									setSubmitting(true);
									onFormSubmit(values);
									setSubmitting(false);
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
													isLoading={isSubmitting}
													type='submit'
													colorScheme='green'
													mr={4}
													variant='solid'>
													Update Group
												</Button>
												<Button onClick={onClose} colorScheme='blue' mr={3}>
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

export default EditGroup;
