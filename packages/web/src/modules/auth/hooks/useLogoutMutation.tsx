import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useLogoutMutation = () => {
	const queryClient = useQueryClient();
	const { data, mutate, isLoading } = useMutation(
		async () => {
			const res = await axios({
				url: '/auth/logout',
				method: 'post',
			});
			return res.data;
		},
		{
			onSuccess() {
				queryClient.setQueryData([RQ.LOGGED_IN_USER_QUERY], null);
			},
		}
	);

	return {
		data,
		mutate,
		isLoading,
	};
};

export default useLogoutMutation;
