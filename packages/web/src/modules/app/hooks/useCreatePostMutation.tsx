import { useMutation } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { navigate } from 'gatsby';

const useCreatePostMutation = () => {
	const { isLoading, data, error, mutate } = useMutation<
		any,
		any,
		{
			content: string;
			imageSettings: string;
			photo: File | null;
			group?: string;
		},
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
				if (data) {
					if (data.group) {
						navigate(`/app/groups/${data.group}`);
					} else {
						navigate('/feed');
					}
				}
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
