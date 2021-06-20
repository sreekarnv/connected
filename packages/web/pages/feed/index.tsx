import {
	Container,
	Heading,
	Button,
	Text,
	Grid,
	GridItem,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Post } from '../../@types';
import CreatePost from '../../src/Feed/CreatePost';
import FeedSidebar from '../../src/Feed/FeedSidebar';
import usePostsQuery, {
	getPosts,
} from '../../src/Feed/hooks/api/queries/usePosts';
import PostItem from '../../src/Feed/PostItem';

interface FeedPageProps {}

const FeedPage: React.FC<FeedPageProps> = ({}) => {
	const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
		usePostsQuery(10);

	return (
		<>
			<CreatePost />
			<Grid
				pt='8'
				px='1rem'
				templateColumns='[left-start] repeat(3, 1fr) [left-end feed-start] repeat(6, 1fr) [feed-end right-start] repeat(3, 1fr) [right-end]'>
				<GridItem gridColumn='left-start / left-end'>
					<FeedSidebar />
				</GridItem>

				<GridItem
					className='hide-scrollbar'
					pb='24'
					px='10'
					h='100vh'
					overflowY='scroll'
					gridColumn='feed-start / feed-end'>
					<Heading mb='10'>My Feed</Heading>
					{isLoading && <Text>Loading Posts....</Text>}
					{data?.pages?.map((page, index: number) =>
						page.posts.map((post: Post) => (
							<PostItem pageParam={index} post={post} key={post._id} />
						))
					)}
					{hasNextPage && (
						<Button
							isLoading={isFetchingNextPage}
							onClick={() => fetchNextPage()}>
							Load More
						</Button>
					)}
				</GridItem>

				<GridItem gridColumn='right-start / right-end'></GridItem>
			</Grid>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const queryClient = new QueryClient();

	const headers = {
		cookie: req.headers.cookie,
	};

	await queryClient.prefetchQuery('posts', () => getPosts(10, 0, headers));

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

export default FeedPage;
