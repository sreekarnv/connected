import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useGetAllUsersQuery = (search = '') => {
	const result = useInfiniteQuery(
		[RQ.GET_ALL_USERS_QUERY, search],
		async ({ pageParam }) => {
			const res = await axios({
				url: '/users',
				method: 'get',
				params: {
					pageParam,
					search,
				},
			});

			return res.data;
		},
		{
			getPreviousPageParam: (data) => {
				if (data.currentPageParam > 1) {
					return data.currentPageParam - 1;
				}

				return 1;
			},
			getNextPageParam: (data) => {
				return data.currentPageParam + 1;
			},
		}
	);

	return { ...result };
};

export default useGetAllUsersQuery;
