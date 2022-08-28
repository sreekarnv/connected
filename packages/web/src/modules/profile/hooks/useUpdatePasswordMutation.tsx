import React from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '../../shared/config/axios';

const useUpdatePasswordMutation = () => {
	const result = useMutation<
		any,
		any,
		{
			password: string;
			newPassword: string;
			passwordConfirm: string;
		},
		any
	>(async ({ newPassword, password, passwordConfirm }) => {
		const res = await axios({
			method: 'patch',
			url: '/users/update-password',
			data: {
				password,
				newPassword,
				passwordConfirm,
			},
		});

		return res.data;
	});

	return result;
};

export default useUpdatePasswordMutation;
