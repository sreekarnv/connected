import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Flex,
	HStack,
	Text,
	useDisclosure,
	IconButton,
	Tooltip,
	MenuList,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	Badge,
	useColorMode,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import Logo from '../../components/Logo';
import ThemeToggler from '../../components/ThemeToggler';
import { NotificationType, UserType } from '../../types/api';
import { RQ } from '../../types/react-query';
import NotificationsDrawer from '../../components/NotificationsDrawer';
import MobileMenuNav from './MobileMenuNav';
import { Link } from 'gatsby';
import useGetAllNotificationsQuery from '../../../app/hooks/useGetAllNotificationsQuery';

interface AppNavbarProps {}

const AppNavbar: React.FC<AppNavbarProps> = ({}) => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { colorMode } = useColorMode();
	const { data: notifications } = useGetAllNotificationsQuery();

	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<>
			<NotificationsDrawer {...{ isOpen, onClose }} />
			<Flex
				position='sticky'
				top='0'
				bgColor={colorMode === 'light' ? 'white' : 'gray.800'}
				justifyContent='space-between'
				zIndex='banner'
				p='4'>
				<HStack gap={3}>
					<Logo />

					<Flex display={{ base: 'none', md: 'flex' }} gap='3'>
						<Tooltip
							placement='top'
							hasArrow
							aria-label='notifications'
							label='Notifications'>
							<IconButton
								display={{ base: 'none', lg: 'flex' }}
								position='relative'
								onClick={() => onOpen()}
								aria-label='notifications'
								icon={
									<>
										<BellIcon fontSize='xl' />
										<Badge
											colorScheme='green'
											variant='solid'
											top='0'
											left='0'
											position='absolute'>
											{notifications?.length}
										</Badge>
									</>
								}
								variant='ghost'
								colorScheme='blue'
							/>
						</Tooltip>

						<Tooltip
							placement='top'
							hasArrow
							aria-label='Create Post'
							label='Create Post'>
							<IconButton
								as={Link}
								to='/app/posts/new'
								display={{ base: 'none', lg: 'flex' }}
								aria-label='Create Post'
								icon={
									<>
										<Box
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											strokeWidth={1.5}
											stroke='currentColor'
											as='svg'
											height='6'
											width='6'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75'
											/>
										</Box>
									</>
								}
								variant='ghost'
								colorScheme='teal'
							/>
						</Tooltip>

						<Tooltip
							placement='top'
							hasArrow
							aria-label='Create Group'
							label='Create Group'>
							<IconButton
								display={{ base: 'none', lg: 'flex' }}
								as={Link}
								to='/app/groups/new'
								aria-label='Create Group'
								icon={
									<>
										<Box
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											strokeWidth={1.5}
											stroke='currentColor'
											as='svg'
											height='6'
											width='6'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z'
											/>
										</Box>
									</>
								}
								variant='ghost'
								colorScheme='purple'
							/>
						</Tooltip>
					</Flex>
				</HStack>
				<HStack
					display={{ base: 'none', lg: 'flex' }}
					as='ul'
					listStyleType={'none'}
					spacing={8}>
					<Menu>
						<MenuButton
							as={Button}
							variant='ghost'
							rightIcon={<ChevronDownIcon />}
							_hover={{
								bgColor: 'transparent',
							}}
							_focusVisible={{
								outline: 'none',
							}}
							_active={{
								bgColor: 'transparent',
								outline: 'none',
							}}>
							<HStack>
								<Avatar src={user.photo?.url} name={user.name} />
								<Text fontWeight='semibold'>{user.name}</Text>
							</HStack>
						</MenuButton>
						<MenuList>
							<MenuItem as={Link} to='/app/feed' fontWeight='semibold'>
								Feed
							</MenuItem>
							<MenuItem as={Link} to='/profile' fontWeight='semibold'>
								My Profile
							</MenuItem>
							<Box display={{ base: 'none', lg: 'block', xl: 'none' }}>
								<MenuDivider />
								<MenuItem as={Link} to='/app/groups/me' fontWeight='semibold'>
									My Groups
								</MenuItem>
								<MenuItem as={Link} to='/app/groups/find' fontWeight='semibold'>
									Find Groups
								</MenuItem>
								<MenuDivider />
								<MenuItem as={Link} to='/app/friends/me' fontWeight='semibold'>
									My Friends
								</MenuItem>
								<MenuItem
									as={Link}
									to='/app/friends/find'
									fontWeight='semibold'>
									Find Friends
								</MenuItem>
							</Box>
							<MenuDivider />
							<MenuItem
								as={Link}
								to='/auth/logout'
								fontWeight='semibold'
								color='red.400'>
								Logout
							</MenuItem>
						</MenuList>
					</Menu>

					<Box as='li'>
						<ThemeToggler />
					</Box>
				</HStack>

				<MobileMenuNav onOpen={onOpen} />
			</Flex>
		</>
	);
};

export default AppNavbar;
