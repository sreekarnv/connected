import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Flex,
	HStack,
	Text,
	useDisclosure,
	Grid,
	GridItem,
	Menu,
	Button,
	MenuButton,
	MenuItem,
	MenuList,
	MenuDivider,
	IconButton,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';

import React from 'react';
import Logo from '../../shared/components/Logo';
import ThemeToggler from '../../shared/components/ThemeToggler';
import { socket } from '../../shared/providers/AppProvider';
import { NotificationType, UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import FeedLinkItem from '../components/FeedLinkItem';
import NotificationItem from '../components/NotificationItem';
import UserProfileCard from '../components/UserProfileCard';
import useGetAllNotificationsQuery from '../hooks/useGetAllNotificationsQuery';

interface FeedLayoutProps {
	children: React.ReactNode;
}

const NotificationsDrawer = ({ isOpen, onClose }: any) => {
	const { isLoading, data } = useGetAllNotificationsQuery();

	return (
		<Drawer isOpen={isOpen} placement='left' onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Notifications</DrawerHeader>

				<DrawerBody px='2'>
					{isLoading && <h1>Loading....</h1>}
					{data && data?.length === 0 ? (
						<h1>No Notifications</h1>
					) : (
						<>
							{data?.map((notification: NotificationType) => (
								<NotificationItem
									notification={notification}
									key={notification._id}
								/>
							))}
						</>
					)}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

const FeedLayout: React.FC<FeedLayoutProps> = ({ children }) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const { isOpen, onClose, onOpen } = useDisclosure();

	React.useEffect(() => {
		socket.on(`user-${user._id}`, (data) => {
			const cachedNotifs =
				(queryClient.getQueryData([
					RQ.GET_ALL_NOTIFICATIONS_QUERY,
				]) as NotificationType[]) || [];

			const newNotifs = [data, ...cachedNotifs];

			queryClient.setQueryData([RQ.GET_ALL_NOTIFICATIONS_QUERY], newNotifs);
		});
	}, [socket]);

	return (
		<>
			<NotificationsDrawer {...{ isOpen, onClose }} />
			<Flex
				position='sticky'
				top='0'
				bgColor='gray.800'
				justifyContent='space-between'
				zIndex='banner'
				p='4'>
				<HStack gap={3}>
					<Logo />

					<IconButton
						onClick={() => onOpen()}
						aria-label='notifications'
						icon={<BellIcon fontSize='xl' />}
						variant='ghost'
						colorScheme='blue'
					/>
				</HStack>
				<HStack
					display={{ base: 'none', md: 'flex' }}
					as='ul'
					listStyleType={'none'}
					spacing={8}>
					<HStack>
						<Avatar src={user.photo?.url} name={user.name} />
						<Text fontWeight='semibold'>{user.name}</Text>
					</HStack>

					<Box as='li'>
						<ThemeToggler />
					</Box>
				</HStack>
				<Box display={{ base: 'block', md: 'none' }}>
					<Menu>
						<MenuButton
							as={Button}
							variant='ghost'
							rightIcon={<ChevronDownIcon />}
							_hover={{
								bgColor: 'transparent',
							}}
							_active={{
								bgColor: 'transparent',
							}}>
							<Avatar src={user.photo?.url} name={user.name} />
						</MenuButton>
						<MenuList>
							<MenuItem as={Link} to='/app/feed' fontWeight='semibold'>
								My Feed
							</MenuItem>
							<MenuItem as={Link} to='/app/posts/new' fontWeight='semibold'>
								Create Post
							</MenuItem>
							<MenuDivider />
							<MenuItem as={Link} to='/app/profile' fontWeight='semibold'>
								My Profile
							</MenuItem>
							<MenuItem
								as={Link}
								to='/app/profile/update'
								fontWeight='semibold'>
								Update Profile
							</MenuItem>
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
				</Box>
			</Flex>

			<Grid
				templateColumns={{
					base: '1rem [content-start] 1fr [content-end] 1rem',
					lg: '.01rem [content-start] repeat(12, [col-start] 1fr [col-end]) [content-end] .01rem',
					'2xl':
						'1.2rem [content-start] repeat(12, [col-start] 1fr [col-end]) [content-end] 1.2rem',
				}}
				columnGap={{ lg: 4, xl: 6, '2xl': 0 }}>
				<GridItem
					display={{
						base: 'none',
						lg: 'block',
					}}
					gridColumn={{
						'2xl': 'content-start / col-end 2',
						xl: 'content-start / col-end 3',
						lg: 'content-start / col-end 4',
					}}>
					<Box position={'sticky'} zIndex='sticky' top='24'>
						<FeedLinkItem color='purple' name='My Feed' to='/app/feed' />
						<FeedLinkItem name='Create Post' to='/app/posts/new' />
						<FeedLinkItem
							color='facebook'
							name='Create Group'
							to='/app/groups/new'
						/>
					</Box>
				</GridItem>
				<GridItem
					gridColumn={{
						base: 'content-start / content-end',
						lg: 'col-start 5 / content-end',
						xl: 'col-start 4 / col-end 9',
					}}>
					<Box pt={{ base: '5', xl: '7' }}>{children}</Box>
				</GridItem>
				<GridItem
					py='4'
					display={{
						base: 'none',
						xl: 'block',
					}}
					gridColumn={{
						'2xl': 'col-start 11 / content-end',
						xl: 'col-start 10 / content-end',
					}}>
					<Box width='100%' position={'sticky'} zIndex='sticky' top='24'>
						<UserProfileCard />
						<Box mt='8'>
							<FeedLinkItem name='Find Groups' to='/app/groups/find' />
							<FeedLinkItem
								color='purple'
								name='Find Friends'
								to='/app/groups/find'
							/>
						</Box>
					</Box>
				</GridItem>
			</Grid>
		</>
	);
};

export default FeedLayout;
