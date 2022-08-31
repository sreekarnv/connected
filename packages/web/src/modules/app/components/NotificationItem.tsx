import {
	Avatar,
	Box,
	Button,
	CloseButton,
	Flex,
	HStack,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { socket } from '../../shared/providers/AppProvider';
import { NotificationType, NotifType, UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import useDeleteNotificationMutation from '../hooks/useDeleteNotificationMutation';
import useRejectFriendRequestMutation from '../hooks/useRejectFriendRequestMutation';
import useRejectJoinGroupMutation from '../hooks/useRejectJoinGroupMutation';

interface NotificationItemProps {
	notification: NotificationType;
}

const loadUi = (notification: NotificationType) => {
	const { mutate } = useDeleteNotificationMutation(notification._id);
	const { isLoading: isRejectLoading, mutate: mutateReject } =
		useRejectJoinGroupMutation(notification._id);
	const { isLoading: isFriendRejectLoading, mutate: mutateFriendReject } =
		useRejectFriendRequestMutation(notification._id);
	const queryClient = useQueryClient();
	const loggedInUser = queryClient.getQueryData([
		RQ.LOGGED_IN_USER_QUERY,
	]) as UserType;

	switch (notification.type) {
		case NotifType.JOIN_GROUP_REQUEST_SENT:
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
							onClick={async () => {
								socket.emit(NotifType.JOIN_GROUP_REQUEST_ACCEPTED, {
									group: notification.group,
									user: notification.sender,
									notificationId: notification._id,
								});

								await queryClient.invalidateQueries([
									RQ.GET_ALL_NOTIFICATIONS_QUERY,
								]);
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
		case NotifType.FRIEND_REQUEST_SENT:
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

					<Text mb='4'>has sent you a friend request.</Text>

					<HStack>
						<Button
							size='sm'
							colorScheme='green'
							onClick={async () => {
								socket.emit(NotifType.FRIEND_REQUEST_ACCEPTED, {
									receiver: {
										_id: loggedInUser._id,
										name: loggedInUser.name,
										photo: loggedInUser.photo,
									},
									sender: notification.sender,
									notificationId: notification._id,
								});

								await queryClient.invalidateQueries([
									RQ.GET_ALL_NOTIFICATIONS_QUERY,
								]);
							}}>
							Accept
						</Button>
						<Button
							onClick={() =>
								mutateFriendReject({
									friendId: notification.sender._id,
								})
							}
							isLoading={isFriendRejectLoading}
							size='sm'
							colorScheme='red'>
							Reject
						</Button>
					</HStack>
				</>
			);
		case NotifType.FRIEND_REQUEST_ACCEPTED:
			return (
				<>
					<Flex mb='1' alignItems='center' justifyContent={'flex-end'}>
						<CloseButton onClick={() => mutate()} />
					</Flex>
					<HStack mb='3'>
						<Avatar
							size='sm'
							src={notification.receiver?.photo?.url}
							name={notification.receiver?.name}
						/>
						<Text fontWeight={'bold'}>{notification.receiver?.name}</Text>
					</HStack>
					<Text>has accepted your friend request</Text>
				</>
			);
	}
};

const NotificationItem: React.FC<NotificationItemProps> = ({
	notification,
}) => {
	const { colorMode } = useColorMode();

	return (
		<>
			<Box
				p='3'
				bgColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
				borderRadius={'xl'}
				mb='4'>
				{loadUi(notification)}
			</Box>
		</>
	);
};

export default NotificationItem;
