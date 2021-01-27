import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import {
	Flex,
	Text,
	HStack,
	IconButton,
	Tooltip,
	useDisclosure,
	Menu,
	MenuButton,
	MenuList,
	Button,
	Divider,
	VStack,
	Circle,
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';
import NavItem from './NavItem';
import './styles/navigation.scss';
import { AuthContext } from '../../store/context/AuthContext';

import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ReactComponent as PostNewIcon } from './../../../assets/icons/post_add.svg';
import { ReactComponent as GroupNewIcon } from './../../../assets/icons/group_add.svg';
import { ReactComponent as NotificationIcon } from './../../../assets/icons/notifications.svg';
import NavMobile from './NavMobile';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import Hidden from '../../components/Hidden/Hidden';
import { UIContext } from '../../store/context/UiContext';
import ThemeToggler from '../../components/ThemeToggler/ThemeToggler';
import { NotificationContext } from '../../store/context/NotificationContext';

const Navigation: React.FC<any> = () => {
	const { user } = useContext(AuthContext);
	const {
		onCreatePostOpen,
		onCreateGroupOpen,
		onNotificationsOpen,
	} = useContext(UIContext);
	const { notifications } = useContext(NotificationContext);

	const { onOpen, onClose, isOpen } = useDisclosure();

	const navbar = (
		<HStack
			spacing={{
				md: 20,
				sm: 10,
			}}
			justifyContent='space-between'
			mx={{ lg: '2rem', sm: 0 }}
			px={{ xl: '4rem', lg: '4rem', md: '2rem', xs: '.75rem' }}
			py={4}
			boxShadow='light'
			alignItems='center'
			className='navbar'>
			<Text
				className='navbar__brand'
				fontSize={'2rem'}
				as={NavLink}
				to={user ? '/' : '/app/public'}>
				Connected
			</Text>

			<NavMobile isOpen={isOpen} onClose={onClose} />

			{user && (
				<>
					<Flex mr='auto'>
						<Hidden hide={{ sm: true, md: true }}>
							<Tooltip hasArrow label='Add Post' aria-label='New Post'>
								<IconButton
									placeItems='center'
									variant='text'
									onClick={onCreatePostOpen}
									aria-label='new post'
									icon={<PostNewIcon fill='dodgerblue' />}
								/>
							</Tooltip>
						</Hidden>

						<Hidden hide={{ sm: true, md: true }}>
							<Tooltip hasArrow label='Add Group' aria-label='New Group'>
								<IconButton
									onClick={onCreateGroupOpen}
									variant='text'
									mr={1}
									aria-label='new group'
									icon={<GroupNewIcon fill='dodgerblue' />}
								/>
							</Tooltip>
						</Hidden>

						<Hidden hide={{ sm: true, md: true }}>
							<>
								<Tooltip
									hasArrow
									label='Notifications'
									aria-label='Notifications'>
									<IconButton
										onClick={onNotificationsOpen}
										variant='text'
										aria-label='notification'
										pos='relative'
										icon={
											<>
												<NotificationIcon fill='dodgerblue' />
												{notifications && notifications.length > 0 && (
													<Circle
														size='8px'
														top='4px'
														right='7px'
														pos='absolute'
														bg='tomato'></Circle>
												)}
											</>
										}
									/>
								</Tooltip>
							</>
						</Hidden>
					</Flex>
				</>
			)}

			{user && (
				<Hidden hide={{ sm: true, md: true }}>
					<HStack spacing={10}>
						<Menu>
							<MenuButton
								_focus={{
									outline: 'none',
								}}
								as={Button}
								variant='text'
								rightIcon={<ChevronDownIcon />}>
								<UserAvatar />
							</MenuButton>
							<MenuList>
								<VStack>
									<NavItem menu to='/app/public'>
										Home
									</NavItem>

									<NavItem menu to='/profile'>
										Profile
									</NavItem>
									<Divider />
									<NavItem menu logout to='/auth/logout'>
										Logout
									</NavItem>
								</VStack>
							</MenuList>
						</Menu>
						<ThemeToggler />
					</HStack>
				</Hidden>
			)}

			{!user && (
				<>
					<HStack
						as='nav'
						display={{
							sm: 'none',
							md: 'none',
							lg: 'block',
							xl: 'block',
						}}
						spacing={'24px'}>
						<NavItem exact to='/'>
							Home
						</NavItem>
						<NavItem exact to='/auth/login'>
							Login
						</NavItem>
						<NavItem exact to='/auth/register'>
							Register
						</NavItem>
						<ThemeToggler
							display={{
								lg: 'inline-block',
								sm: 'none',
							}}
						/>
					</HStack>
				</>
			)}

			<IconButton
				onClick={onOpen}
				aria-label='Hamburger Menu'
				cursor='pointer'
				variant='text'
				_focus={{
					outline: 'none',
				}}
				icon={<HamburgerIcon w={7} h={7} />}
				display={{
					sm: 'block',
					md: 'block',
					lg: 'none',
					xl: 'none',
				}}></IconButton>
		</HStack>
	);

	return ReactDOM.createPortal(
		navbar,
		document.getElementById('navbar-wrapper')!
	);
};

export default Navigation;
