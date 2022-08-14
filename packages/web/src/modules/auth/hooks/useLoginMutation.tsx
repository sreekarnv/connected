import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useLoginMutation = () => {
	const queryClient = useQueryClient();
	const { data, mutate, isLoading } = useMutation<
		any,
		any,
		{ email: string; password: string },
		any
	>(
		async (data) => {
			const res = await axios({
				url: '/auth/login',
				method: 'post',
				data,
			});
			return res.data;
		},
		{
			onSuccess(data) {
				queryClient.setQueryData([RQ.LOGGED_IN_USER_QUERY], data.user);
			},
		}
	);

	return {
		data,
		mutate,
		isLoading,
	};
};

export default useLoginMutation;
