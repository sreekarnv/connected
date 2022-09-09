import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SearchIcon,
} from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	SimpleGrid,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import debounce from 'lodash/debounce';
import useGetAllUsersQuery from '../hooks/useGetAllUsersQuery';
import { UserType } from '../../shared/types/api';
import MyFriendItem from '../components/MyFriendItem';
import FindItemSkeleton from '../components/FindItemSkeleton';
import { Link } from 'gatsby';

interface MyFriendsPageProps {}

const MyFriendsPage: React.FC<MyFriendsPageProps> = ({}) => {
	const [search, setSearch] = React.useState('');
	const { colorMode } = useColorMode();
	const { data, isLoading, page, setPage } = useGetAllUsersQuery(
		search,
		'friends-only'
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPage(1);
		const value = e.target.value;
		setSearch(value);
	};

	const handleDebouncedSearch = React.useCallback(
		debounce(handleSearch, 1000),
		[]
	);

	if (isLoading) {
		return (
			<>
				<SimpleGrid gap={3} columns={{ base: 1, sm: 2, lg: 3 }}>
					{Array(9)
						.fill(0)
						.map((_, index) => (
							<FindItemSkeleton key={index} />
						))}
				</SimpleGrid>
			</>
		);
	}

	return (
		<>
			<Box>
				{!!data?.users?.length && (
					<>
						<InputGroup>
							<InputLeftElement
								pointerEvents='none'
								children={<SearchIcon />}
							/>
							<Input
								placeholder='Search by name'
								onChange={handleDebouncedSearch}
							/>
						</InputGroup>

						<Box mt='5'>
							<SimpleGrid gap={3} columns={{ base: 1, sm: 2, lg: 3 }}>
								{data?.users?.map((friend: UserType) => {
									return <MyFriendItem key={friend._id} user={friend} />;
								})}
							</SimpleGrid>
							<Flex
								justifyContent='center'
								py={{ base: '4' }}
								mt={{ lg: '10' }}
								alignItems='center'
								gap={4}>
								<IconButton
									onClick={async () => {
										setPage(page - 1);
									}}
									disabled={page === 1}
									icon={<ChevronLeftIcon fontSize={20} />}
									aria-label='Back'
								/>
								<Text fontWeight='bold'>{page}</Text>
								<IconButton
									onClick={() => {
										if (data.hasNext) {
											setPage(page + 1);
										}
									}}
									disabled={!data?.hasNext}
									icon={<ChevronRightIcon fontSize={20} />}
									aria-label='Next'
								/>
							</Flex>
						</Box>
					</>
				)}

				{data?.users?.length === 0 && (
					<>
						<Box pt='6' textAlign='center'>
							<Text
								textAlign='center'
								fontWeight='semibold'
								color={colorMode === 'dark' ? 'red.400' : 'red.600'}
								fontSize='3xl'
								mb='5'>
								You have no friends
							</Text>
							<Button as={Link} to='/app/friends/find' colorScheme='blue'>
								Find Friends
							</Button>
						</Box>
					</>
				)}
			</Box>
		</>
	);
};

export default MyFriendsPage;
