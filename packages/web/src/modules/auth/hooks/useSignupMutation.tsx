import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useSignupMutation = () => {
	const queryClient = useQueryClient();
	const { data, mutate, isLoading } = useMutation<
		any,
		any,
		{
			name: string;
			email: string;
			password: string;
			passwordConfirm: string;
			photo: File | null;
		},
		any
	>(
		async (data) => {
			const res = await axios({
				url: '/auth/signup',
				method: 'post',
				data,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
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

export default useSignupMutation;
