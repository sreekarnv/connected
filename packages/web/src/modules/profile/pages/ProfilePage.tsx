import React from 'react';
import * as Yup from 'yup';
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
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Flex,
	Text,
	Switch,
	HStack,
} from '@chakra-ui/react';

import { SmallAddIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import useCroppedImage from '../../shared/hooks/useCropperImage';
import ImageCropper from '../../shared/components/ImageCropper';
import { useQueryClient } from '@tanstack/react-query';
import { RQ } from '../../shared/types/react-query';
import { UserType } from '../../shared/types/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useUpdatePasswordMutation from '../hooks/useUpdatePasswordMutation';
import useUpdateProfileMutation from '../hooks/useUpdateProfileMutation';
import useDesktopNotifications from '../../shared/hooks/useDesktopNotifications';

const detailsSchema = Yup.object().shape({
	name: Yup.string().required('Please provide your name'),
	email: Yup.string()
		.email('Please provide a valid email')
		.required('Please provide your email'),
});

const passwordSchema = Yup.object().shape({
	password: Yup.string().required('provide your current password'),
	newPassword: Yup.string()
		.min(6, 'Password should atleast contain a minimum of 6 characters')
		.required('Please protect your account with a password'),
	passwordConfirm: Yup.string()
		.when('password', {
			is: (val: string) => (val && val.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref('newPassword')],
				'passwords do not match'
			),
		})
		.required('Confirm your password'),
});

const ProfilePage: React.FC = () => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const { enableNotifications, notifPermission } = useDesktopNotifications();
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

	const {
		register: updateDetails,
		handleSubmit: handleDetailsSubmit,
		formState: { errors: updateErrors, isDirty: isUpdateDirty, isSubmitting },
	} = useForm({
		resolver: yupResolver(detailsSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
		},
	});

	const {
		register: updatePassword,
		handleSubmit: handlePasswordSubmit,
		formState: { errors: passwordErrors },
	} = useForm({
		resolver: yupResolver(passwordSchema),
	});

	const { isLoading: isPasswordLoading, mutate: mutatePassword } =
		useUpdatePasswordMutation();

	const { isLoading: isProfileLoading, mutateAsync: mutateProfile } =
		useUpdateProfileMutation();

	const savePhoto = async () => {
		if (image && imageSettings) {
			await mutateProfile({
				imageSettings: JSON.stringify(imageSettings),
				photo: image,
			});

			resetValues();
		}
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
			<Box
				bgColor={colorMode === 'light' ? 'secondary.100' : 'gray.800'}
				{...styles.outerContainer}
				className='hide-scrollbar'
				p={5}>
				<Box mb={{ lg: 6, sm: 2 }} textAlign='center'>
					<Heading>My Profile</Heading>
				</Box>
				<SimpleGrid {...styles.innerContainer}>
					<Box alignSelf='center' w='max-content' pos='relative'>
						{!isProfileLoading && (
							<Avatar
								borderRadius='lg'
								overflow='hidden'
								boxSize={{
									md: '400px',
									base: '300px',
								}}
								src={croppedImage || (user && user.photo?.url)}
								name={user?.name}
							/>
						)}
						{isProfileLoading && (
							<Box
								boxSize={{
									md: '400px',
									base: '300px',
								}}
								borderRadius='lg'
								overflow='hidden'
								padding='6'
								boxShadow='lg'>
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
						{!isProfileLoading && (
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
						<Tabs mt={{ base: '8', sm: '2', md: '0' }}>
							<TabList
								overflowY='hidden'
								sx={{
									scrollbarWidth: 'none',
									'::-webkit-scrollbar': {
										display: 'none',
									},
								}}>
								<Tab flexShrink={0}>Update Details</Tab>
								<Tab flexShrink={0}>Update Password</Tab>
								<Tab flexShrink={0}>Other Settings</Tab>
							</TabList>

							<TabPanels minHeight={{ base: '20vh', md: '40vh' }}>
								<TabPanel>
									<form
										noValidate
										onSubmit={handleDetailsSubmit((data) => {
											return mutateProfile({
												email: data.email,
												name: data.name,
											});
										})}>
										<FormControl
											mb='4'
											isRequired
											isInvalid={!!updateErrors.email}>
											<FormLabel>Email address</FormLabel>
											<Input
												borderColor={
													colorMode === 'light' ? 'gray.300' : 'inherit'
												}
												type='email'
												{...updateDetails('email')}
											/>
											<FormErrorMessage>
												{updateErrors.email?.message as string}
											</FormErrorMessage>
										</FormControl>

										<FormControl isRequired isInvalid={!!updateErrors.name}>
											<FormLabel>Name</FormLabel>
											<Input
												borderColor={
													colorMode === 'light' ? 'gray.300' : 'inherit'
												}
												type='text'
												{...updateDetails('name')}
											/>
											<FormErrorMessage>
												{updateErrors.name?.message as string}
											</FormErrorMessage>
										</FormControl>

										<Button
											isLoading={isSubmitting}
											disabled={!isUpdateDirty || isProfileLoading}
											colorScheme='blue'
											type='submit'
											mt='5'>
											Update Details
										</Button>
									</form>
								</TabPanel>
								<TabPanel>
									<form
										noValidate
										autoComplete='off'
										onSubmit={handlePasswordSubmit((data) => {
											return mutatePassword({
												newPassword: data.newPassword,
												password: data.password,
												passwordConfirm: data.passwordConfirm,
											});
										})}>
										<FormControl
											mb='4'
											isRequired
											isInvalid={!!passwordErrors.password}>
											<FormLabel>Password</FormLabel>
											<Input
												borderColor={
													colorMode === 'light' ? 'gray.300' : 'inherit'
												}
												type='password'
												{...updatePassword('password')}
											/>
											<FormErrorMessage>
												{passwordErrors.password?.message as string}
											</FormErrorMessage>
										</FormControl>

										<FormControl
											mb='4'
											isRequired
											isInvalid={!!passwordErrors.newPassword}>
											<FormLabel>New Password</FormLabel>
											<Input
												borderColor={
													colorMode === 'light' ? 'gray.300' : 'inherit'
												}
												type='password'
												{...updatePassword('newPassword')}
											/>
											<FormErrorMessage>
												{passwordErrors.newPassword?.message as string}
											</FormErrorMessage>
										</FormControl>

										<FormControl
											mb='4'
											isRequired
											isInvalid={!!passwordErrors.passwordConfirm}>
											<FormLabel>Password Confirm</FormLabel>
											<Input
												borderColor={
													colorMode === 'light' ? 'gray.300' : 'inherit'
												}
												type='password'
												{...updatePassword('passwordConfirm')}
											/>
											<FormErrorMessage>
												{passwordErrors.passwordConfirm?.message as string}
											</FormErrorMessage>
										</FormControl>

										<Button
											isLoading={isPasswordLoading}
											colorScheme='blue'
											type='submit'
											mt='6'>
											Update Password
										</Button>
									</form>
								</TabPanel>

								<TabPanel>
									<Flex justifyContent='flex-start' py={{ lg: 4, sm: 2 }}>
										<HStack>
											<Text>Enable Desktop Notifications</Text>
											<Switch
												isChecked={notifPermission === 'granted'}
												onChange={() => enableNotifications()}
											/>
										</HStack>
									</Flex>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>
				</SimpleGrid>
			</Box>
		</>
	);
};

const styles = {
	outerContainer: {
		mx: {
			lg: 10,
			md: 4,
		},
		borderRadius: 'lg',
		h: '90vh',
		overflowY: 'scroll' as any,
	},
	// simple grid
	innerContainer: {
		py: 10,
		rowGap: {
			sm: 10,
			md: 0,
		},
		h: { lg: '65vh', sm: 'auto' },
		columns: {
			lg: 2,
			md: 1,
		},
		justifyItems: 'center',
	},
	iconbtn: {
		cursor: 'pointer' as any,
		bgGradient: 'linear(blue.600, purple.400)',
		pos: 'absolute' as any,
		borderRadius: '50%',
		transition: 'all .3s ease-out',
		_hover: {
			bgGradient: 'linear(purple.400, blue.500)',
		},
		_active: {
			bgGradient: 'linear(purple.400, blue.500)',
		},
	},
	iconbtnDel: {
		cursor: 'pointer' as any,
		bgGradient: 'linear(red.600, red.400)',
		pos: 'absolute' as any,
		borderRadius: '50%',
		transition: 'all .3s ease-out',
		_hover: {
			bgGradient: 'linear(red.400, red.500)',
		},
		_active: {
			bgGradient: 'linear(red.400, red.500)',
		},
	},
};

export default ProfilePage;
