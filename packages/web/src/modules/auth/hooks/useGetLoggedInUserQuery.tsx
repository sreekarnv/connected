import { useQuery } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useGetLoggedInUserQuery = () => {
	const { data, isLoading } = useQuery([RQ.LOGGED_IN_USER_QUERY], async () => {
		const res = await axios({
			url: '/auth/me',
			method: 'get',
		});
		return res.data.user;
	});

	return {
		data,
		isLoading,
	};
};

export default useGetLoggedInUserQuery;
