import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import PostItem from '../components/PostItem';
import PostSkeleton from '../components/PostItemSkeleton';
import useGetAllPostsQuery from '../hooks/useGetAllPostsQuery';

interface FeedPageProps {
	path?: string;
}

const FeedPage: React.FC<FeedPageProps> = ({}) => {
	const { data, fetchNextPage, isFetchingNextPage, isLoading } =
		useGetAllPostsQuery();
	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	if (isLoading) {
		return (
			<>
				{Array(3)
					.fill(0)
					.map((_, index) => (
						<PostSkeleton key={index} />
					))}
			</>
		);
	}

	return (
		<>
			<Box mt='8'>
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
						mb='4'
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
			</Box>
		</>
	);
};

export default FeedPage;
