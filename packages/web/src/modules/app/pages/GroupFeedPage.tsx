import { Avatar, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import PostItem from '../components/PostItem';
import useGetAllPostsQuery from '../hooks/useGetAllPostsQuery';
import useGetGroupQuery from '../hooks/useGetGroupQuery';

interface GroupFeedPageProps {
	id: string;
}

const GroupFeedPage: React.FC<GroupFeedPageProps> = ({ id }) => {
	const { data, isLoading: isLoadingGroup } = useGetGroupQuery(id);
	const {
		isLoading,
		data: posts,
		error,
		fetchNextPage,
		isFetchingNextPage,
	} = useGetAllPostsQuery(id);
	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	if (isLoading || isLoadingGroup) {
		return (
			<>
				<Text textAlign='center'>Loading...</Text>
			</>
		);
	}

	if (error) {
		return (
			<VStack mt='8'>
				<Text color='red.400' mb='5' fontWeight='semibold' fontSize={'lg'}>
					{(error as any).response.data.message}
				</Text>
				<Button as={Link} to='/app/feed' variant='solid'>
					Back to Feed
				</Button>
			</VStack>
		);
	}

	return (
		<>
			<Flex alignItems={'center'} justifyContent='space-between' mb='8'>
				<HStack gap='3'>
					<Avatar size='lg' src={data?.photo?.url} name={data?.name} />
					<Text fontSize='2xl' fontWeight='bold'>
						{data?.name}
					</Text>
				</HStack>

				<Text>
					Created By{' '}
					<Text as='span' fontWeight='semibold'>
						{data?.admin.name}{' '}
					</Text>
				</Text>
			</Flex>

			{posts?.pages.map((page) => {
				return page?.posts?.map((post: any) => (
					<PostItem
						pageParam={page.currentPageParam}
						post={post}
						key={post._id}
					/>
				));
			})}

			{posts?.pages[posts?.pages.length - 1].hasNext && (
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

export default GroupFeedPage;
