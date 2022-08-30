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
	Divider,
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
			<HStack display={{ base: 'flex', lg: 'none' }}>
				<HStack spacing={5}>
					<IconButton
						as={Link}
						display={{ base: 'none', md: 'flex' }}
						to='/app/posts/new'
						size='lg'
						borderRadius='full'
						aria-label='Create Post'
						icon={
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
						}
						variant='outline'
						colorScheme='purple'
					/>

					<IconButton
						as={Link}
						display={{ base: 'none', md: 'flex' }}
						to='/app/groups/me'
						size='lg'
						borderRadius='full'
						aria-label='My Groups'
						icon={
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
						}
						variant='outline'
						colorScheme='telegram'
					/>
					<IconButton
						as={Link}
						display={{ base: 'none', md: 'flex' }}
						to='/app/friends/me'
						size='lg'
						borderRadius='full'
						aria-label='My Friends'
						icon={
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
									d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
								/>
							</Box>
						}
						variant='outline'
						colorScheme='teal'
					/>
					<IconButton
						size='lg'
						borderRadius='full'
						onClick={() => onOpen()}
						aria-label='notifications'
						icon={<BellIcon fontSize='xl' />}
						variant='outline'
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
						<MenuItem as={Link} to='/app/groups/find' fontWeight='semibold'>
							Find Groups
						</MenuItem>
						<MenuDivider />
						<MenuItem as={Link} to='/app/friends/me' fontWeight='semibold'>
							My Friends
						</MenuItem>
						<MenuItem as={Link} to='/app/friends/find' fontWeight='semibold'>
							Find Friends
						</MenuItem>

						<Divider />

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
