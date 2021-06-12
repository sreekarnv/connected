import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import * as React from 'react';
import usePostsQuery from '../../shared/hooks/api/posts/queries/usePosts';
import { Post } from '../../shared/types';
import PostItem from '../components/PostItem';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
	const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
		usePostsQuery(10);

	return (
		<Container maxWidth='container.sm'>
			<Heading mb='10'>My Feed</Heading>
			{isLoading && <Text>Loading Posts....</Text>}
			{data?.pages.map((page) =>
				page.posts.map((post: Post) => <PostItem post={post} key={post._id} />)
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
