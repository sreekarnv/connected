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
import { NotificationType, NotifType, UserType } from '../types/api';
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
	const queryClient = useQueryClient();
	const notifications = queryClient.getQueryData([
		RQ.GET_ALL_NOTIFICATIONS_QUERY,
	]) as NotificationType[];
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	React.useEffect(() => {
		socket.on(`user-${user._id}`, (data) => {
			let notif: Notification | null = null;

			if (Notification.permission === 'granted') {
				let body = '';
				let title = '';
				let defaultIcon =
					'/static/og-image-f6683a653d7fdc48ab660b5e219e9bc0.png';
				let defaultBadge =
					'/static/og-image-f6683a653d7fdc48ab660b5e219e9bc0.png';

				if (data.type === NotifType.FRIEND_REQUEST_SENT) {
					title = 'Got a friend request';
					body = `${data.sender.name} sent you a friend request`;
				} else if (data.type === NotifType.FRIEND_REQUEST_ACCEPTED) {
					title = 'Friend request accepted';
					body = `${data.sender.name} accepted you a friend request`;
				} else if (data.type === NotifType.JOIN_GROUP_REQUEST_SENT) {
					title = 'Got a join group request';
					body = `${data.sender.name} sent you a join group request`;
				} else if (data.type === NotifType.JOIN_GROUP_REQUEST_ACCEPTED) {
					title = 'Join group request accepted';
					body = `${data.sender.name} accepted you a join group request`;
				}

				notif = new Notification(title, {
					body,
					badge: data?.sender?.photo?.url || defaultBadge,
					icon: data?.sender?.photo?.url || defaultIcon,
				});
			}

			const cachedNotifs =
				(queryClient.getQueryData([
					RQ.GET_ALL_NOTIFICATIONS_QUERY,
				]) as NotificationType[]) || [];

			const newNotifs = [data, ...cachedNotifs];

			queryClient.setQueryData([RQ.GET_ALL_NOTIFICATIONS_QUERY], newNotifs);
		});
	}, []);

	return (
		<Drawer isOpen={isOpen} placement='left' onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Notifications</DrawerHeader>

				<DrawerBody px='2'>
					{notifications?.length === 0 ? (
						<Text
							my='5'
							textAlign='center'
							fontWeight='semibold'
							color='red.400'>
							You don't have any notifications
						</Text>
					) : (
						<>
							{notifications?.map((notification: NotificationType) => (
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
