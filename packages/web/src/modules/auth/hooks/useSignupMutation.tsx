import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { navigate } from 'gatsby';
import React from 'react';
import axios from '../../shared/config/axios';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

const useSignupMutation = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	const { data, mutate, isLoading } = useMutation<
		any,
		any,
		{
			name: string;
			email: string;
			password: string;
			passwordConfirm: string;
			photo: File | null;
			imageSettings: string;
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
			onMutate: () => {
				toast.closeAll();
			},
			onSuccess: (data: { user: UserType }) => {
				queryClient.setQueryData([RQ.LOGGED_IN_USER_QUERY], data.user);

				toast({
					position: 'top',
					title: 'Account created.',
					description: "We've created your account for you.",
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
					title: 'Signup Failed',
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

export default useSignupMutation;
