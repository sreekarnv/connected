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

interface AppNavbarProps {}

const AppNavbar: React.FC<AppNavbarProps> = ({}) => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

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

					<Box display={{ base: 'none', md: 'block' }}>
						<Tooltip
							placement='top'
							hasArrow
							aria-label='notifications'
							label='Notifications'>
							<IconButton
								onClick={() => onOpen()}
								aria-label='notifications'
								icon={<BellIcon fontSize='xl' />}
								variant='ghost'
								colorScheme='blue'
							/>
						</Tooltip>
					</Box>
				</HStack>
				<HStack
					display={{ base: 'none', md: 'flex' }}
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
