import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { NotificationType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

const useDeleteNotificationMutation = (notificationId: string) => {
	const queryClient = useQueryClient();
	const result = useMutation(
		async () => {
			const res = await axios({
				url: `/notifications/${notificationId}`,
				method: 'delete',
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
			onSettled: () => {
				queryClient.invalidateQueries([RQ.GET_ALL_NOTIFICATIONS_QUERY]);
			},
		}
	);

	return result;
};

export default useDeleteNotificationMutation;
