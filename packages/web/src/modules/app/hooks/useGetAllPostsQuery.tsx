import {
	useInfiniteQuery,
	InfiniteData,
	InitialDataFunction,
} from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

type Options = {
	initialData?: InfiniteData<any> | InitialDataFunction<InfiniteData<any>>;
};

const useGetAllPostsQuery = (groupId = '', options: Options = {}) => {
	const result = useInfiniteQuery(
		[RQ.GET_ALL_POSTS_QUERY, groupId],
		async ({ pageParam = 1 }) => {
			const res = await axios({
				url: '/posts',
				method: 'get',
				params: {
					pageParam,
					groupId,
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
			initialData: options.initialData,
		}
	);

	return result;
};

export default useGetAllPostsQuery;
