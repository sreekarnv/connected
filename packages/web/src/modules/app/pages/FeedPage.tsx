import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	Grid,
	GridItem,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Logo from '../../shared/components/Logo';
import ThemeToggler from '../../shared/components/ThemeToggler';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import FeedLinkItem from '../components/FeedLinkItem';
import PostItem from '../components/PostItem';
import UserProfileCard from '../components/UserProfileCard';
import useGetAllPostsQuery from '../hooks/useGetAllPostsQuery';
import FeedLayout from '../layouts/FeedLayout';

interface FeedPageProps {
	path?: string;
}

const FeedPage: React.FC<FeedPageProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const { data, fetchNextPage, isFetchingNextPage } = useGetAllPostsQuery();
	const { ref, inView } = useInView();
	const { isOpen } = useDisclosure();

	React.useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<>
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
		</>
	);
};

export default FeedPage;
