import React from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Text,
} from '@chakra-ui/react';
import NotificationItem from '../../app/components/NotificationItem';
import useGetAllNotificationsQuery from '../../app/hooks/useGetAllNotificationsQuery';
import { NotificationType, UserType } from '../types/api';
import { socket } from '../providers/AppProvider';
import { RQ } from '../types/react-query';
import { useQueryClient } from '@tanstack/react-query';

interface NotificationsDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
	isOpen,
	onClose,
}) => {
	const { isLoading, data } = useGetAllNotificationsQuery();
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	React.useEffect(() => {
		socket.on(`user-${user._id}`, (data) => {
			const cachedNotifs =
				(queryClient.getQueryData([
					RQ.GET_ALL_NOTIFICATIONS_QUERY,
				]) as NotificationType[]) || [];

			const newNotifs = [data, ...cachedNotifs];

			queryClient.setQueryData([RQ.GET_ALL_NOTIFICATIONS_QUERY], newNotifs);
		});
	}, [socket]);

	return (
		<Drawer isOpen={isOpen} placement='left' onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Notifications</DrawerHeader>

				<DrawerBody px='2'>
					{isLoading && <h1>Loading....</h1>}
					{data && data?.length === 0 ? (
						<Text
							my='5'
							textAlign='center'
							fontWeight='semibold'
							color='red.400'>
							You don't have any notifications
						</Text>
					) : (
						<>
							{data?.map((notification: NotificationType) => (
								<NotificationItem
									notification={notification}
									key={notification._id}
								/>
							))}
						</>
					)}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default NotificationsDrawer;
