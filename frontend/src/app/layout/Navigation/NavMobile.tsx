import {
	Drawer,
	DrawerContent,
	DrawerOverlay,
	DrawerCloseButton,
	VStack,
	DrawerBody,
	Divider,
	DrawerHeader,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import ThemeToggler from '../../components/ThemeToggler/ThemeToggler';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { AuthContext } from '../../store/context/AuthContext';
import NavItem from './NavItem';

const NavMobile = (props: any) => {
	const { user } = useContext(AuthContext);
	const { isOpen, onClose } = props;

	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose}>
			<DrawerOverlay>
				<DrawerContent>
					<DrawerCloseButton />

					{user && (
						<DrawerHeader>
							<UserAvatar />
						</DrawerHeader>
					)}

					<DrawerBody justifyItems='start'>
						<VStack>
							{!user && (
								<>
									<NavItem onClose={onClose} exact to='/'>
										Home
									</NavItem>
									<NavItem onClose={onClose} exact to='/auth/login'>
										Login
									</NavItem>
									<NavItem onClose={onClose} exact to='/auth/register'>
										Register
									</NavItem>
								</>
							)}
							{user && (
								<>
									<NavItem onClose={onClose} to='/app'>
										Home
									</NavItem>
									<NavItem onClose={onClose} exact to='/profile'>
										Profile
									</NavItem>

									<Divider />
									<NavItem
										color='red.600'
										onClose={onClose}
										exact
										to='/auth/logout'>
										Logout
									</NavItem>
								</>
							)}
							<Divider />
							<ThemeToggler />
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</DrawerOverlay>
		</Drawer>
	);
};

export default NavMobile;
