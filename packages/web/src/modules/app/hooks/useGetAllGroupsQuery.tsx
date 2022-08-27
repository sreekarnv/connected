import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useGetAllGroupsQuery = (search = '') => {
	const result = useInfiniteQuery(
		[RQ.GET_ALL_GROUPS_QUERY, search],
		async ({ pageParam = 1 }) => {
			const res = await axios({
				url: '/groups',
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
			getNextPageParam: (data) => data.currentPageParam + 1,
		}
	);

	return result;
};

export default useGetAllGroupsQuery;
