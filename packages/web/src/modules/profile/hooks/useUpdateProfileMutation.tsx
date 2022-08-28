import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { navigate } from 'gatsby';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useUpdateProfileMutation = () => {
	const queryClient = useQueryClient();
	const result = useMutation<
		any,
		any,
		{
			name?: string;
			email?: string;
			photo?: File | null;
			imageSettings?: string;
		},
		any
	>(
		async (data) => {
			const res = await axios({
				url: '/users',
				method: 'patch',
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

	return result;
};

export default useUpdateProfileMutation;
