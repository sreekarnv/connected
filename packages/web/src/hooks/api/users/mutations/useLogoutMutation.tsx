import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import axios from '../../../../config/axios';

const useLogoutMutation = () => {
	const queryClient = useQueryClient();
	const history = useHistory();

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
					history.replace('/');
				}
			},
		}
	);

	return { data, error, isLoading, mutate };
};

export default useLogoutMutation;
