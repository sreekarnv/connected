import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Menu,
	Button,
	MenuButton,
	MenuItem,
	MenuList,
	MenuDivider,
	HStack,
	Divider,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';

import React from 'react';
import ThemeToggler from '../../components/ThemeToggler';
import CreateGroupIcon from '../../icons/CreateGroupIcon';
import CreatePostIcon from '../../icons/CreatePostIcon';
import FeedIcon from '../../icons/FeedIcon';
import FindFriendsIcon from '../../icons/FindFriendsIcon';
import FindGroupIcon from '../../icons/FindGroupIcon';
import LogoutIcon from '../../icons/LogoutIcon';
import MyFriendsIcon from '../../icons/MyFriendsIcon';
import MyGroupsIcon from '../../icons/MyGroupsIcon';
import UserProfileIcon from '../../icons/UserProfileIcon';
import { UserType } from '../../types/api';
import { RQ } from '../../types/react-query';
import MobileMenuNavIconLink from './MobileMenuNavIconLink';

interface MobileMenuNavProps {
	onOpen: () => void;
}

const MobileMenuNav: React.FC<MobileMenuNavProps> = ({ onOpen }) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<>
			<HStack display={{ base: 'flex', lg: 'none' }}>
				<HStack spacing={5}>
					<MobileMenuNavIconLink
						to='/app/posts/new'
						label='Create Post'
						icon={<CreatePostIcon />}
						colorScheme='purple'
					/>

					<MobileMenuNavIconLink
						to='/app/groups/me'
						label='My Groups'
						icon={<MyGroupsIcon />}
						colorScheme='telegram'
					/>

					<MobileMenuNavIconLink
						to='/app/friends/me'
						label='My Friends'
						icon={<MyFriendsIcon />}
						colorScheme='teal'
					/>

					<MobileMenuNavIconLink
						onClick={() => onOpen()}
						label='Notifications'
						display={'block'}
						icon={<BellIcon fontSize='xl' />}
						colorScheme='twitter'
					/>
				</HStack>

				<Menu>
					<MenuButton
						as={Button}
						variant='ghost'
						_focusVisible={{
							outline: 'none',
						}}
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
						<MenuItem
							icon={<FeedIcon />}
							as={Link}
							to='/feed'
							fontWeight='semibold'>
							My Feed
						</MenuItem>
						<MenuItem
							icon={<CreatePostIcon />}
							as={Link}
							to='/app/posts/new'
							fontWeight='semibold'>
							Create Post
						</MenuItem>
						<MenuDivider />
						<MenuItem
							icon={<CreateGroupIcon />}
							as={Link}
							to='/app/groups/new'
							fontWeight='semibold'>
							Create Group
						</MenuItem>
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
						<MenuDivider />
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

						<Divider />

						<MenuItem
							icon={<UserProfileIcon />}
							as={Link}
							to='/profile'
							fontWeight='semibold'>
							My Profile
						</MenuItem>
						<MenuItem
							icon={<LogoutIcon />}
							as={Link}
							to='/auth/logout'
							fontWeight='semibold'
							color='red.400'>
							Logout
						</MenuItem>

						<MenuDivider />
						<Box p='3'>
							<ThemeToggler />
						</Box>
					</MenuList>
				</Menu>
			</HStack>
		</>
	);
};

export default MobileMenuNav;
