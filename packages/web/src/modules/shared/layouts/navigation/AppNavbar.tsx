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
	MenuGroup,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import Logo from '../../components/Logo';
import ThemeToggler from '../../components/ThemeToggler';
import { UserType } from '../../types/api';
import { RQ } from '../../types/react-query';
import NotificationsDrawer from '../../components/NotificationsDrawer';
import MobileMenuNav from './MobileMenuNav';
import { Link } from 'gatsby';
import useGetAllNotificationsQuery from '../../../app/hooks/useGetAllNotificationsQuery';
import LogoutIcon from '../../icons/LogoutIcon';
import CreateGroupIcon from '../../icons/CreateGroupIcon';
import FeedIcon from '../../icons/FeedIcon';
import CreatePostIcon from '../../icons/CreatePostIcon';
import UserProfileIcon from '../../icons/UserProfileIcon';
import FindFriendsIcon from '../../icons/FindFriendsIcon';
import MyFriendsIcon from '../../icons/MyFriendsIcon';
import FindGroupIcon from '../../icons/FindGroupIcon';
import MyGroupsIcon from '../../icons/MyGroupsIcon';

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
								icon={<CreatePostIcon />}
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
								icon={<CreateGroupIcon />}
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
							<MenuItem
								icon={<FeedIcon />}
								as={Link}
								to='/app/feed'
								fontWeight='semibold'>
								Feed
							</MenuItem>
							<MenuItem
								icon={<UserProfileIcon />}
								as={Link}
								to='/profile'
								fontWeight='semibold'>
								My Profile
							</MenuItem>
							<Box display={{ base: 'none', lg: 'block', xl: 'none' }}>
								<MenuDivider />
								<MenuGroup fontWeight={'bold'} title='Group'>
									<MenuItem
										icon={<MyGroupsIcon />}
										as={Link}
										to='/app/groups/me'
										fontWeight='semibold'>
										My Groups
									</MenuItem>
									<MenuItem
										icon={<FindGroupIcon />}
										as={Link}
										to='/app/groups/find'
										fontWeight='semibold'>
										Find Groups
									</MenuItem>
								</MenuGroup>
								<MenuDivider />
								<MenuGroup title='Friends' fontWeight={'bold'}>
									<MenuItem
										icon={<MyFriendsIcon />}
										as={Link}
										to='/app/friends/me'
										fontWeight='semibold'>
										My Friends
									</MenuItem>
									<MenuItem
										icon={<FindFriendsIcon />}
										as={Link}
										to='/app/friends/find'
										fontWeight='semibold'>
										Find Friends
									</MenuItem>
								</MenuGroup>
							</Box>
							<MenuDivider />
							<MenuItem
								icon={<LogoutIcon h={6} w={6} />}
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
