import { useMutation, useQueryClient } from 'react-query';
import axios from '../../../../lib/axios';

const useVotePost = (postId: string, pageParam: number) => {
	const queryClient = useQueryClient();

	const { mutate, error, data, isLoading, variables } = useMutation<
		any,
		any,
		{ vote: 'like' | 'dislike' }
	>(
		async (data) => {
			const res = await axios({
				method: 'patch',
				url: `/api/posts/${postId}/vote`,
				data,
			});

			return res.data.updatedPost;
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

export default useVotePost;
