import { useMutation } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { navigate } from 'gatsby';

const useCreateGroupMutation = () => {
	const res = useMutation<
		any,
		any,
		{
			name: string;
			groupType: string;
			description: string;
			imageSettings: string;
			photo: File | null;
		},
		any
	>(
		async (data) => {
			const res = await axios({
				url: '/groups',
				method: 'post',
				data,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return res.data.group;
		},
		{
			onSuccess: (data) => {
				if (data?._id) {
					navigate(`/app/groups/${data._id}`);
				}
			},
		}
	);

	return res;
};

export default useCreateGroupMutation;
