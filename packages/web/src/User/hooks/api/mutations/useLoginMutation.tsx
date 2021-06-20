import { useRouter } from 'next/dist/client/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from '../../../../../lib/axios';

const useLoginMutation = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, error, isLoading, mutate } = useMutation<
		any,
		any,
		{ email: string; password: string }
	>(
		async (data) => {
			const res = await axios({
				method: 'POST',
				url: '/api/users/login',
				data,
			});
			return res.data.user;
		},
		{
			onSuccess: (data) => {
				queryClient.setQueryData('me', data);
			},
			onSettled: (data, error) => {
				if (data) {
					router.replace('/feed');
				}

				if (error) {
					console.log(error);
				}
			},
		}
	);

	return { data, error, isLoading, mutate };
};

export default useLoginMutation;
