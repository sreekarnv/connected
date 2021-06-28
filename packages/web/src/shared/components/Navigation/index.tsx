import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Button,
	Divider,
	Flex,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tooltip,
	VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useQueryClient } from 'react-query';
import useLogoutMutation from '../../../User/hooks/api/mutations/useLogoutMutation';
import Logo from '../../components/Logo';
import ThemeToggler from '../../components/ThemeToggler';
import UserAvatar from '../../components/UserAvatar';
import { PostContext } from '../../context/PostContext';
import NavItem from './NavItem';
import NavMenuItem from './NavMenuItem';
import { EditIcon } from '@chakra-ui/icons';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData('me');
	const router = useRouter();
	const { mutate } = useLogoutMutation();
	const { onCreatePostOpen } = React.useContext(PostContext);

	return (
		<Flex p='4' alignItems='center' justifyContent='space-between'>
			<HStack spacing='10'>
				<Logo />
				<Tooltip label='Create Post' title='Create Post' hasArrow>
					<IconButton
						borderRadius='md'
						bg='transparent'
						_hover={{
							bg: 'transparent',
						}}
						aria-label='Create Post'
						color='primary.200'
						onClick={onCreatePostOpen}>
						<EditIcon />
					</IconButton>
				</Tooltip>
			</HStack>
			<HStack spacing={3}>
				<NavItem href={user ? '/feed' : '/'}>Home</NavItem>
				{!user && (
					<>
						<NavItem href='/auth/login'>Login</NavItem>
						<NavItem href='/auth/register'>Register</NavItem>
					</>
				)}
				{user && (
					<>
						<Menu>
							<MenuButton
								_focus={{
									outline: 'none',
								}}
								as={Button}
								variant='text'
								rightIcon={<ChevronDownIcon />}>
								<UserAvatar user={user} />
							</MenuButton>
							<MenuList>
								<VStack>
									<NavMenuItem href='/profile'>Profile</NavMenuItem>
									<Divider />
									<MenuItem
										textTransform='uppercase'
										onClick={async () => {
											mutate();
											router.replace('/');
										}}
										color='red.300'>
										Logout
									</MenuItem>
								</VStack>
							</MenuList>
						</Menu>
					</>
				)}
				<ThemeToggler />
			</HStack>
		</Flex>
	);
};

export default Navigation;
