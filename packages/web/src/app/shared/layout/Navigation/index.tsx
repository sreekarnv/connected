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
import * as React from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import Logo from '../../components/Logo';
import ThemeToggler from '../../components/ThemeToggler';
import UserAvatar from '../../components/UserAvatar';
import useLogoutMutation from '../../hooks/api/users/mutations/useLogoutMutation';
import NavItem from './NavItem';
import NavMenuItem from './NavMenuItem';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData('me');
	const history = useHistory();
	const { mutate } = useLogoutMutation();

	return (
		<Flex p='4' alignItems='center' justifyContent='space-between'>
			<Logo />
			<HStack spacing={3}>
				<NavItem to='/' exact>
					Home
				</NavItem>
				{!user && (
					<>
						<NavItem to='/auth/login' exact>
							Login
						</NavItem>
						<NavItem to='/auth/register' exact>
							Register
						</NavItem>
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
									<NavMenuItem to='/profile'>Profile</NavMenuItem>
									<Divider />
									<MenuItem
										textTransform='uppercase'
										onClick={async () => {
											mutate();
											history.replace('/');
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
