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
	IconButton,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';

import React from 'react';
import ThemeToggler from '../../components/ThemeToggler';
import { UserType } from '../../types/api';
import { RQ } from '../../types/react-query';

interface MobileMenuNavProps {
	onOpen: () => void;
}

const MobileMenuNav: React.FC<MobileMenuNavProps> = ({ onOpen }) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<>
			<HStack display={{ base: 'block', md: 'none' }}>
				<IconButton
					size='lg'
					borderRadius='full'
					onClick={() => onOpen()}
					aria-label='notifications'
					icon={<BellIcon fontSize='xl' />}
					variant='outline'
					colorScheme='blue'
				/>
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
						<MenuItem as={Link} to='/app/groups/new' fontWeight='semibold'>
							Create Group
						</MenuItem>
						<MenuItem as={Link} to='/app/posts/new' fontWeight='semibold'>
							Find Groups
						</MenuItem>
						<MenuDivider />
						<MenuItem as={Link} to='/profile' fontWeight='semibold'>
							My Profile
						</MenuItem>
						<MenuItem
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
