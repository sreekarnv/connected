import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { navigate } from 'gatsby';
import React from 'react';
import axios from '../../shared/config/axios';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

const useLoginMutation = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
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
			onMutate: () => {
				toast.closeAll();
			},
			onSuccess: (data: { user: UserType }) => {
				queryClient.setQueryData([RQ.LOGGED_IN_USER_QUERY], data.user);

				toast({
					position: 'top',
					title: 'Logged In.',
					description: 'You can access your account',
					status: 'success',
					duration: 1500,
					isClosable: true,
					onCloseComplete() {
						navigate('/app/feed', { replace: true });
					},
				});
			},
			onError: (error) => {
				toast({
					position: 'top',
					title: 'Login Failed',
					description: error.response.data.message,
					status: 'error',
					duration: 4000,
					isClosable: true,
				});
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
