import {
	Avatar,
	Box,
	Button,
	CloseButton,
	Flex,
	HStack,
	Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { socket } from '../../shared/providers/AppProvider';
import { NotificationType, NotifType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import useDeleteNotificationMutation from '../hooks/useDeleteNotificationMutation';
import useRejectJoinGroupMutation from '../hooks/useRejectJoinGroupMutation';

interface NotificationItemProps {
	notification: NotificationType;
}

const loadUi = (notification: NotificationType) => {
	switch (notification.type) {
		case NotifType.JOIN_GROUP_REQUEST_SENT:
			const { isLoading: isRejectLoading, mutate: mutateReject } =
				useRejectJoinGroupMutation(notification._id);

			const queryClient = useQueryClient();
			return (
				<>
					<HStack mb='3'>
						<Avatar
							size='sm'
							src={notification.sender.photo?.url}
							name={notification.sender.name}
						/>
						<Text fontWeight={'bold'}>{notification.sender.name}</Text>
					</HStack>

					<Text mb='4'>
						{notification.type === NotifType.JOIN_GROUP_REQUEST_SENT &&
							`has requested to join "${notification.group?.name}" group`}
					</Text>

					<HStack>
						<Button
							size='sm'
							colorScheme='green'
							onClick={() => {
								socket.emit(NotifType.JOIN_GROUP_REQUEST_ACCEPTED, {
									group: notification.group,
									user: notification.sender,
									notificationId: notification._id,
								});

								const notificationsCached = queryClient.getQueryData([
									RQ.GET_ALL_NOTIFICATIONS_QUERY,
								]) as NotificationType[];
								const newNotifications = notificationsCached.filter(
									(n) => notification._id !== n._id
								);
								queryClient.setQueryData(
									[RQ.GET_ALL_NOTIFICATIONS_QUERY],
									newNotifications
								);
							}}>
							Accept
						</Button>
						<Button
							onClick={() =>
								mutateReject({
									groupId: notification.group!._id,
									member: notification.sender._id,
								})
							}
							isLoading={isRejectLoading}
							size='sm'
							colorScheme='red'>
							Reject
						</Button>
					</HStack>
				</>
			);
		case NotifType.JOIN_GROUP_REQUEST_ACCEPTED:
			const { mutate } = useDeleteNotificationMutation(notification._id);

			return (
				<>
					<Flex mb='1' alignItems='center' justifyContent={'flex-end'}>
						<CloseButton onClick={() => mutate()} />
					</Flex>
					<HStack mb='3'>
						<Avatar
							size='sm'
							src={notification.group?.photo?.url}
							name={notification.group?.name}
						/>
						<Text fontWeight={'bold'}>{notification.group?.name}</Text>
					</HStack>
					<Text>Your request to join this group has been accepted.</Text>
				</>
			);
	}
};

const NotificationItem: React.FC<NotificationItemProps> = ({
	notification,
}) => {
	return (
		<>
			<Box p='3' bgColor='gray.900' borderRadius={'xl'} mb='4'>
				{loadUi(notification)}
			</Box>
		</>
	);
};

export default NotificationItem;
