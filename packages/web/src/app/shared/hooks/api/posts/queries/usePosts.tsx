import { useInfiniteQuery } from 'react-query';
import axios from '../../../../config/axios';

const usePostsQuery = (limit: number) => {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery(
		'posts',
		async ({ pageParam }) => {
			const res = await axios({
				method: 'GET',
				url: '/api/posts',
				params: {
					limit,
					page: pageParam,
				},
			});
			return {
				posts: res.data.posts,
				hasNext: res.data.hasNext,
			};
		},
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.hasNext) return pages.length;

				return false;
			},
		}
	);
	return {
		data,
		error,
		fetchNextPage,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		status,
	};
};

export default usePostsQuery;
