import { useMutation } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';
import { navigate } from 'gatsby';

const useCreatePostMutation = () => {
	const { isLoading, data, error, mutate } = useMutation<
		any,
		any,
		{ content: string; imageSettings: string; photo: File | null },
		any
	>(
		async (data) => {
			const res = await axios({
				url: '/posts',
				method: 'post',
				data,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return res.data.post;
		},
		{
			onSuccess: (data) => {
				navigate('/app/feed');
			},
		}
	);

	return {
		isLoading,
		error,
		data,
		mutate,
	};
};

export default useCreatePostMutation;
