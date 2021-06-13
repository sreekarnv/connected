import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import axios from '../../../../config/axios';

const useLoginMutation = () => {
	const queryClient = useQueryClient();
	const history = useHistory();

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
					history.replace('/');
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
