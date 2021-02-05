import React, { Suspense, useContext, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import {
	Box,
	IconButton,
	SimpleGrid,
	Tooltip,
	useColorMode,
	Heading,
	Button,
	ButtonGroup,
	Tabs,
	TabList,
	Tab,
	SkeletonText,
	SkeletonCircle,
	TabPanels,
	TabPanel,
	Avatar,
} from '@chakra-ui/react';

import { SmallAddIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

import useCroppedImage from '../../hooks/useCroppedImage';
import useAlert from '../../hooks/useAlert';

import { AuthContext } from '../../store/context/AuthContext';

import Loader from '../../components/Spinner/Spinner';

import styles from './profileStyles';

const InputField = React.lazy(() => import('../../components/Form/InputField'));
const ImageCropper = React.lazy(
	() => import('../../components/ImageCropper/ImageCropper')
);
const BaseAlert = React.lazy(() => import('../../components/Alert/BaseAlert'));

const detailsSchema = Yup.object().shape({
	firstName: Yup.string().required('Please provide your firstname'),
	lastName: Yup.string().required('Please provide your lastname'),
	email: Yup.string()
		.email('Please provide a valid email')
		.required('Please provide your email'),
});

const passwordSchema = Yup.object().shape({
	currentPassword: Yup.string().required('provide your current password'),
	password: Yup.string()
		.min(6, 'Password should atleast contain a minimum of 6 characters')
		.required('Please protect your account with a password'),
	passwordConfirm: Yup.string()
		.when('password', {
			is: (val: string) => (val && val.length > 0 ? true : false),
			then: Yup.string().oneOf([Yup.ref('password')], 'passwords do not match'),
		})
		.required('Confirm your password'),
});

const Profile = () => {
	const { user, updateUser } = useContext(AuthContext);
	const { colorMode } = useColorMode();
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
		openImageCropper,
		resetValues,
	} = useCroppedImage();
	const [saveImageInit, setSaveImageInit] = useState(false);

	const detailsInitialValues = {
		firstName: user.firstName,
		middleName: user.middleName || '',
		lastName: user.lastName,
		email: user.email,
	};

	const passwordInitialValues = {
		currentPassword: '',
		password: '',
		passwordConfirm: '',
	};

	const savePhoto = async () => {
		setSaveImageInit(true);
		const data = new FormData();
		data.append('photo', image!);
		data.append('imageSettings', JSON.stringify(imageSettings!));

		try {
			const res = await axios({
				url: '/api/v1/users/updateSettings',
				method: 'PATCH',
				data,
			});

			updateUser(res.data.user);
			resetValues();
		} catch (err) {}
		setSaveImageInit(false);
	};

	const { setAlert, isAlertOpen, alertDetails } = useAlert();

	const history = useHistory();

	return (
		<Suspense fallback={<Loader />}>
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
			<Box
				bgColor={colorMode === 'light' ? 'secondary.100' : 'gray.700'}
				{...styles.outerContainer}
				className='hide-scrollbar'
				p={5}>
				<Box mb={{ lg: 20, sm: 2 }} textAlign='center'>
					<Heading>My Profile</Heading>
				</Box>
				<SimpleGrid {...styles.innerContainer}>
					<Box alignSelf='center' w='max-content' pos='relative'>
						{!saveImageInit && (
							<Avatar
								borderRadius='0'
								boxSize={{
									md: '400px',
									sm: '300px',
								}}
								src={croppedImage || (user && user.photo?.url)}
								alt={user && user.firstName}
							/>
						)}
						{saveImageInit && (
							<Box boxSize='400px' padding='6' boxShadow='lg' bg='white'>
								<SkeletonCircle size='10' />
								<SkeletonText mt='4' noOfLines={8} spacing='4' />
							</Box>
						)}
						<input
							onChange={(e: any) => setImage(e.target.files[0])}
							type='file'
							name='image-upload'
							id='image-upload'
							style={{ display: 'none' }}
						/>
						{!saveImageInit && (
							<ButtonGroup>
								{image && (
									<Tooltip hasArrow label='Remove Changes'>
										<IconButton
											bottom='20px'
											left='10px'
											onClick={resetValues}
											{...styles.iconbtnDel}
											aria-label='revert changes'
											icon={<CloseIcon color='#fff' />}
										/>
									</Tooltip>
								)}

								{image && (
									<Tooltip hasArrow label='Save Photo'>
										<IconButton
											bottom='20px'
											right='100px'
											onClick={savePhoto}
											{...styles.iconbtn}
											aria-label='save photo'
											icon={<CheckIcon color='#fff' />}
										/>
									</Tooltip>
								)}

								{image && (
									<Tooltip hasArrow label='Edit Photo'>
										<IconButton
											bottom='20px'
											right='55px'
											onClick={openImageCropper}
											{...styles.iconbtn}
											aria-label='edit photo'
											icon={<EditIcon color='#fff' />}
										/>
									</Tooltip>
								)}

								<Tooltip hasArrow label='Change Photo'>
									<IconButton
										bottom='20px'
										right='10px'
										as='label'
										htmlFor='image-upload'
										{...styles.iconbtn}
										aria-label='change photo'
										icon={<SmallAddIcon color='#fff' />}
									/>
								</Tooltip>
							</ButtonGroup>
						)}
					</Box>
					<Box alignSelf='center' w='100%'>
						<Tabs>
							<TabList>
								<Tab>Update Settings</Tab>
								<Tab>Update Password</Tab>
							</TabList>

							<TabPanels>
								<TabPanel>
									<Formik
										validationSchema={detailsSchema}
										initialValues={detailsInitialValues}
										onSubmit={async (values, { setSubmitting, resetForm }) => {
											const { firstName, middleName, lastName, email } = values;
											const data = new FormData();
											data.append('firstName', firstName);
											if (middleName && middleName.trim() !== '') {
												data.append('middleName', middleName);
											}
											data.append('lastName', lastName);
											data.append('email', email);

											try {
												const res = await axios({
													url: '/api/v1/users/updateSettings',
													method: 'PATCH',
													data,
												});

												updateUser(res.data.user);
												const values = {
													firstName: res.data.user.firstName,
													middleName: res.data.user.middleName || '',
													lastName: res.data.user.lastName,
													email: res.data.user.email,
												};

												resetValues();
												resetForm({ values });
												setAlert('success', 'user details updated succesfully');
												setSubmitting(false);
											} catch (err) {
												setAlert('error', 'could not update user details');
												setSubmitting(false);
											}
										}}>
										{({ dirty, isValid, isSubmitting }) => (
											<Box as={Form} minH='400px' autoComplete='off'>
												<InputField name='firstName' label='firstName' />
												<InputField
													required={false}
													name='middleName'
													label='middleName'
												/>
												<InputField name='lastName' label='lastName' />
												<InputField name='email' label='Email' />
												{isValid && dirty && (
													<Button
														isLoading={isSubmitting}
														type='submit'
														colorScheme='primary'>
														Save
													</Button>
												)}
											</Box>
										)}
									</Formik>
								</TabPanel>
								<TabPanel>
									<Formik
										validationSchema={passwordSchema}
										initialValues={passwordInitialValues}
										onSubmit={async (values, { setSubmitting, resetForm }) => {
											const data = { ...values };

											try {
												await axios({
													url: '/api/v1/users/updateCurrentUserPassword',
													method: 'POST',
													data,
												});

												resetForm();
												setAlert(
													'success',
													'user password updated succesfully. You will be logged out...'
												);
												setSubmitting(false);
												setTimeout(() => {
													history.replace('/auth/logout');
												}, 2000);
											} catch (err) {
												setAlert('error', err.response.data.message);
												setSubmitting(false);
											}
										}}>
										{({ dirty, isValid, isSubmitting }) => (
											<Box minH='400px' as={Form} autoComplete='off'>
												<InputField
													name='currentPassword'
													label='Current Password'
													type='password'
												/>
												<InputField
													type='password'
													name='password'
													label='New Password'
												/>
												<InputField
													name='passwordConfirm'
													label='Password Confirm'
													type='password'
												/>
												<Button
													disabled={(!dirty && isValid) || (dirty && !isValid)}
													isLoading={isSubmitting}
													type='submit'
													colorScheme='primary'>
													Save
												</Button>
											</Box>
										)}
									</Formik>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>
				</SimpleGrid>
			</Box>
		</Suspense>
	);
};

export default Profile;
