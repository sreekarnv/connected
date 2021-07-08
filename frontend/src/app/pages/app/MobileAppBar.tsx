import {
	Circle,
	Flex,
	HStack,
	Icon,
	IconButton,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { UIContext } from '../../store/context/UiContext';

import { HamburgerIcon } from '@chakra-ui/icons';
import { ReactComponent as NotificationIcon } from './../../../assets/icons/notifications.svg';
import { ReactComponent as NewPostIcon } from './../../../assets/icons/post_add.svg';
import { ReactComponent as UsersIcon } from './../../../assets/icons/users.svg';
import { ReactComponent as NewGroupIcon } from './../../../assets/icons/group_add.svg';
import { ReactComponent as GroupIcon } from './../../../assets/icons/groups.svg';
import { ReactComponent as PublicIcon } from './../../../assets/icons/globe.svg';
import AppBarItem from './components/Nav/AppBarItem';
import Hidden from '../../components/Hidden/Hidden';
import MobileSideBar from './MobileSideBar';
import { NotificationContext } from '../../store/context/NotificationContext';

const MobileAppBar = () => {
	const { onCreatePostOpen, onCreateGroupOpen, onNotificationsOpen } =
		useContext(UIContext);
	const {
		isOpen: isMobileSidebarOpen,
		onClose: onMobileSidebarClose,
		onOpen: onMobileSidebarOpen,
	} = useDisclosure();

	const { notifications } = useContext(NotificationContext);

	return (
		<>
			<MobileSideBar
				isOpen={isMobileSidebarOpen}
				onClose={onMobileSidebarClose}
			/>
			<Flex
				position='fixed'
				bottom={0}
				left={0}
				width={'100%'}
				zIndex={100}
				p={2}
				h='auto'
				bgColor='primary.300'>
				<AppBarItem
					as='div'
					onClick={onMobileSidebarOpen}
					label='appbar-menu'
					icon={
						<HamburgerIcon color='tertiary' height='1.5rem' width='1.5rem' />
					}
				/>

				<HStack m='0 auto'>
					<Hidden hide={{ xl: true, lg: true, sm: true }}>
						<AppBarItem
							to='/app/find-groups'
							label='appbar-menu'
							icon={
								<Icon
									as={GroupIcon}
									color='tertiary'
									height='1.5rem'
									width='1.5rem'
								/>
							}
						/>
					</Hidden>

					<HStack>
						<AppBarItem
							onClick={onCreateGroupOpen}
							as='div'
							label='appbar-new-group'
							icon={
								<Icon
									as={NewGroupIcon}
									color='tertiary'
									height='1.5rem'
									width='1.5rem'
								/>
							}
						/>

						<AppBarItem
							to='/app/public'
							label='appbar-public'
							icon={
								<Icon
									as={PublicIcon}
									color='tertiary'
									height='1.5rem'
									width='1.5rem'
								/>
							}
						/>

						<AppBarItem
							as='div'
							onClick={onCreatePostOpen}
							label='appbar-new-post'
							icon={
								<Icon
									as={NewPostIcon}
									color='tertiary'
									height='1.5rem'
									width='1.5rem'
								/>
							}
						/>
					</HStack>

					<Hidden hide={{ xl: true, lg: true, sm: true }}>
						<AppBarItem
							to='/app/find-friends'
							label='appbar-menu'
							icon={
								<Icon
									as={UsersIcon}
									color='tertiary'
									height='1.1rem'
									width='1.1rem'
								/>
							}
						/>
					</Hidden>
				</HStack>

				<IconButton
					bgColor='primary.300'
					_hover={{
						bgColor: 'primary.300',
					}}
					_active={{
						bgColor: 'primary.400',
					}}
					_focus={{
						bgColor: 'primary.400',
					}}
					h='3.5rem'
					w='3.5rem'
					aria-label='notifications'
					onClick={onNotificationsOpen}
					icon={
						<>
							<Icon
								as={NotificationIcon}
								color='tertiary'
								height='1.5rem'
								width='1.5rem'
							/>
							{notifications && notifications.length > 0 && (
								<Circle
									size='8px'
									top='10px'
									right='10px'
									pos='absolute'
									bg='tomato'></Circle>
							)}
						</>
					}
				/>
			</Flex>
		</>
	);
};

export default MobileAppBar;
