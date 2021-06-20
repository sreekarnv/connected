import { useMutation, useQueryClient } from 'react-query';
import axios from '../../../../../lib/axios';

const useCreatePost = () => {
	const queryClient = useQueryClient();

	const { mutate, error, data, isLoading, variables } = useMutation<
		any,
		any,
		{ content: string }
	>(
		async (data) => {
			const res = await axios({
				method: 'post',
				url: `/api/posts`,
				data,
			});

			return res.data;
		},
		{
			onSuccess: async () => {
				queryClient.invalidateQueries('posts');
			},
		}
	);

	return {
		mutate,
		error,
		data,
		isLoading,
		variables,
	};
};

export default useCreatePost;
