import { useQuery } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useGetAllPostsQuery = () => {
	const { isLoading, data, error } = useQuery(
		[RQ.GET_ALL_POSTS_QUERY],
		async () => {
			const res = await axios({
				url: '/posts',
				method: 'get',
			});
			return res.data;
		}
	);

	return {
		isLoading,
		error,
		data,
	};
};

export default useGetAllPostsQuery;
