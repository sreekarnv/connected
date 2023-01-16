import { useQuery } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useGetAllNotificationsQuery = ({ enabled }: { enabled?: boolean }) => {
	const result = useQuery(
		[RQ.GET_ALL_NOTIFICATIONS_QUERY],
		async () => {
			const res = await axios({
				url: '/notifications',
				method: 'get',
			});

			return res.data.notifications ?? null;
		},
		{
			enabled,
		}
	);

	return result;
};

export default useGetAllNotificationsQuery;
