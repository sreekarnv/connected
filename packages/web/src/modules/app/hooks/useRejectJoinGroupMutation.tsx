import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { NotificationType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

const useRejectJoinGroupMutation = (notificationId: string) => {
	const queryClient = useQueryClient();
	const result = useMutation<
		any,
		any,
		{ groupId: string; member: string },
		any
	>(
		async ({ groupId, member }) => {
			const res = await axios({
				url: `/groups/reject-join-request/${groupId}`,
				method: 'patch',
				data: {
					member,
					notificationId,
				},
			});

			return res.data;
		},
		{
			onSuccess: () => {
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
			},
		}
	);

	return result;
};

export default useRejectJoinGroupMutation;
