import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import * as React from 'react';
import usePostsQuery from '../../../hooks/api/posts/queries/usePosts';
import { Post } from '../../../config/types';
import CreatePost from '../components/CreatePost';
import PostItem from '../components/PostItem';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
	const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
		usePostsQuery(10);

	return (
		<Container maxWidth='container.md'>
			<CreatePost />
			<Heading mb='10'>My Feed</Heading>
			{isLoading && <Text>Loading Posts....</Text>}
			{data?.pages.map((page, index: number) =>
				page.posts.map((post: Post) => (
					<PostItem pageParam={index} post={post} key={post._id} />
				))
			)}
			{hasNextPage && (
				<Button isLoading={isFetchingNextPage} onClick={() => fetchNextPage()}>
					Load More
				</Button>
			)}
		</Container>
	);
};

export default Home;
