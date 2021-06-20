import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Button,
	Divider,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
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

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData('me');
	const router = useRouter();
	const { mutate } = useLogoutMutation();
	const { onCreatePostOpen } = React.useContext(PostContext);

	return (
		<Flex p='4' alignItems='center' justifyContent='space-between'>
			<Logo />
			<HStack>
				<Button onClick={onCreatePostOpen}>Create Post</Button>
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
