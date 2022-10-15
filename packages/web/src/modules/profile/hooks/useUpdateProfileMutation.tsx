import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { navigate } from 'gatsby';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useUpdateProfileMutation = () => {
	const toast = useToast();
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
			onMutate: () => {
				toast.closeAll();
			},
			onSuccess: (data) => {
				toast({
					position: 'top',
					title: 'Profile Updated',
					description: 'You will be redirected to your feed',
					status: 'success',
					duration: 1500,
					isClosable: true,
					onCloseComplete() {
						navigate('/feed');
					},
				});
				queryClient.setQueryData([RQ.LOGGED_IN_USER_QUERY], data.user);
			},
			onError: (error) => {
				toast({
					position: 'top',
					title: 'Profile Update Failed',
					description: error?.response?.data?.message,
					status: 'error',
					duration: 1500,
					isClosable: true,
				});
			},
		}
	);

	return result;
};

export default useUpdateProfileMutation;
