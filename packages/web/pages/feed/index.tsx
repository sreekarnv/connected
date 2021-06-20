import { Container, Heading, Button, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Post } from '../../@types';
import CreatePost from '../../src/Post/CreatePost';
import usePostsQuery, {
	getPosts,
} from '../../src/Post/hooks/api/queries/usePosts';
import PostItem from '../../src/Post/PostItem';

interface FeedPageProps {}

const FeedPage: React.FC<FeedPageProps> = ({}) => {
	const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
		usePostsQuery(10);

	return (
		<>
			<Container maxWidth='container.md'>
				<CreatePost />
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
			</Container>
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
