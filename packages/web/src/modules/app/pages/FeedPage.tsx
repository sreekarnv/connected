import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import PostItem from '../components/PostItem';
import useGetAllPostsQuery from '../hooks/useGetAllPostsQuery';

interface FeedPageProps {
	path?: string;
}

const FeedPage: React.FC<FeedPageProps> = ({}) => {
	const { data, fetchNextPage, isFetchingNextPage } = useGetAllPostsQuery();
	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<>
			{data?.pages.map((page) => {
				return page?.posts.map((post: any) => (
					<PostItem
						pageParam={page.currentPageParam}
						post={post}
						key={post._id}
					/>
				));
			})}

			{data?.pages[data?.pages.length - 1].hasNext && (
				<Button
					display='block'
					isLoading={isFetchingNextPage}
					mx='auto'
					ref={ref}
					onClick={() => {
						fetchNextPage();
					}}>
					Fetch Next
				</Button>
			)}
		</>
	);
};

export default FeedPage;
