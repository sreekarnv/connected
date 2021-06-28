import { useInfiniteQuery } from 'react-query';
import axios from '../../../../lib/axios';

export const getPosts = async (limit, pageParam = 0, headers?) => {
	const res = await axios({
		method: 'GET',
		url: '/api/posts',
		params: {
			limit,
			page: pageParam,
		},
		headers: {
			...headers,
		},
	});
	return {
		posts: res.data.posts,
		hasNext: res.data.hasNext,
	};
};

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
		async ({ pageParam = 0 }) => await getPosts(limit, pageParam),
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
