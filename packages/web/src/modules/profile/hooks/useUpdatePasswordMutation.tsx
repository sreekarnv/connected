import React from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '../../shared/config/axios';
import { useToast } from '@chakra-ui/react';
import { navigate } from 'gatsby';

const useUpdatePasswordMutation = () => {
	const toast = useToast();

	const result = useMutation<
		any,
		any,
		{
			password: string;
			newPassword: string;
			passwordConfirm: string;
		},
		any
	>(
		async ({ newPassword, password, passwordConfirm }) => {
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
		},
		{
			onSuccess: () => {
				toast({
					position: 'top',
					title: 'Password Updated',
					description: 'You will be logged out in a moment.',
					status: 'success',
					duration: 1500,
					isClosable: true,
					onCloseComplete() {
						navigate('/auth/logout', { replace: true });
					},
				});
			},
			onError: (error) => {
				toast({
					position: 'top',
					title: 'Password Update Failed',
					description: error.response.data.message,
					status: 'error',
					duration: 1500,
					isClosable: true,
				});
			},
		}
	);

	return result;
};

export default useUpdatePasswordMutation;
