import { useRouter } from 'next/dist/client/router';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../../../../lib/axios';

const useLogoutMutation = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { data, error, isLoading, mutate } = useMutation(
		async () => {
			await axios({
				method: 'GET',
				url: '/api/users/logout',
			});

			return null;
		},
		{
			onSuccess: (data) => {
				queryClient.setQueryData('me', data);
			},
			onSettled: (data) => {
				if (data) {
					router.replace('/');
				}
			},
		}
	);

	return { data, error, isLoading, mutate };
};

export default useLogoutMutation;
