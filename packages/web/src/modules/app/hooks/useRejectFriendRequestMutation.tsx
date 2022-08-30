import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { NotificationType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

const useRejectFriendRequestMutation = (notificationId: string) => {
	const queryClient = useQueryClient();
	const result = useMutation<any, any, { friendId: string }, any>(
		async ({ friendId }) => {
			const res = await axios({
				url: `/users/reject-friend-request`,
				method: 'patch',
				data: {
					friendId,
					notificationId,
				},
			});

			return res.data.user;
		},
		{
			onSuccess: (data) => {
				const notificationsCached = queryClient.getQueryData([
					RQ.GET_ALL_NOTIFICATIONS_QUERY,
				]) as NotificationType[];
				const newNotifications = notificationsCached.filter(
					(notification) => notification._id !== notificationId
				);
				queryClient.setQueryData(
					[RQ.GET_ALL_NOTIFICATIONS_QUERY],
					newNotifications
				);

				queryClient.setQueryData([RQ.LOGGED_IN_USER_QUERY], data);
			},
		}
	);

	return result;
};

export default useRejectFriendRequestMutation;
