import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	useDisclosure,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Logo from '../../shared/components/Logo';
import ThemeToggler from '../../shared/components/ThemeToggler';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import PostItem from '../components/PostItem';
import useGetAllPostsQuery from '../hooks/useGetAllPostsQuery';

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
			<Flex
				position='sticky'
				top='0'
				bgColor='gray.800'
				justifyContent='space-between'
				zIndex='banner'
				p='4'>
				<HStack>
					<Logo />

					<Button as={Link} to='/app/posts/new'>
						Create Post
					</Button>
				</HStack>
				<HStack as='ul' listStyleType={'none'} spacing={8}>
					<Menu>
						<MenuButton
							isActive={isOpen}
							as={Button}
							variant='ghost'
							_hover={{
								bg: 'transparent',
							}}
							_active={{
								bg: 'transparent',
							}}
							rightIcon={<ChevronDownIcon />}>
							<HStack>
								<Avatar src={user.photo?.url} name={user.name} />
								<Text fontWeight='semibold'>{user.name}</Text>
							</HStack>
						</MenuButton>
						<MenuList>
							<MenuItem as={Link} fontWeight='semibold' to='/app/posts/new'>
								Create Post
							</MenuItem>
							<MenuItem as={Link} fontWeight='semibold' to='/app/profile'>
								My Profile
							</MenuItem>
							<MenuDivider />
							<MenuItem
								as={Link}
								color='red.400'
								fontWeight='semibold'
								to='/auth/logout'>
								Logout
							</MenuItem>
						</MenuList>
					</Menu>

					<Box as='li'>
						<ThemeToggler />
					</Box>
				</HStack>
			</Flex>

			<Container maxWidth='container.lg' py='4'>
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
			</Container>
		</>
	);
};

export default FeedPage;
