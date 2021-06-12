import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import axios from '../../../../config/axios';

const registerUser = async (data: any) => {
	const res = await axios({
		method: 'POST',
		url: '/api/users/register',
		data,
	});
	console.log({ res });
	return res.data.user;
};

const useRegisterMutation = () => {
	const queryClient = useQueryClient();
	const history = useHistory();

	const { data, error, isLoading, mutate } = useMutation<
		any,
		any,
		{ email: string; password: string; passwordConfirm: string; name: string }
	>(registerUser, {
		onSuccess: (data) => {
			queryClient.invalidateQueries('me');
		},
		onSettled: (data, error) => {
			if (data) {
				history.replace('/');
			}

			if (error) {
				console.log(error);
			}
		},
	});

	return { data, error, isLoading, mutate };
};

export default useRegisterMutation;
