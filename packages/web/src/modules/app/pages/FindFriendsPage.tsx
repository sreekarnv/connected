import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SearchIcon,
} from '@chakra-ui/icons';
import {
	Box,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	SimpleGrid,
	Text,
} from '@chakra-ui/react';
import React from 'react';
import debounce from 'lodash/debounce';
import useGetAllUsersQuery from '../hooks/useGetAllUsersQuery';
import { UserType } from '../../shared/types/api';
import FindFriendItem from '../components/FindFriendItem';

interface FindFriendsPageProps {}

const FindFriendsPage: React.FC<FindFriendsPageProps> = ({}) => {
	const [search, setSearch] = React.useState('');
	const [page, setPage] = React.useState(1);
	const { data, isLoading, fetchNextPage, fetchPreviousPage } =
		useGetAllUsersQuery(search);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPage(1);
		const value = e.target.value;
		setSearch(value);
	};

	const handleDebouncedSearch = React.useCallback(
		debounce(handleSearch, 1000),
		[]
	);

	return (
		<>
			<Box>
				<InputGroup>
					<InputLeftElement pointerEvents='none' children={<SearchIcon />} />
					<Input
						placeholder='Search by name'
						onChange={handleDebouncedSearch}
					/>
				</InputGroup>
				<Box mt='5'>
					{isLoading && <p>Loading....</p>}
					<SimpleGrid gap={3} columns={{ base: 1, sm: 2, lg: 3 }}>
						{data?.pages?.[page - 1]?.users.map((friend: UserType) => {
							return <FindFriendItem key={friend._id} user={friend} />;
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
								if (page > 1) {
									await fetchPreviousPage({ pageParam: page - 1 });
									setPage(page - 1);
								}
							}}
							disabled={page === 1}
							icon={<ChevronLeftIcon fontSize={20} />}
							aria-label='Back'
						/>
						<Text fontWeight='bold'>{page}</Text>
						<IconButton
							onClick={async () => {
								if (data?.pages[page - 1].hasNext) {
									await fetchNextPage({ pageParam: page + 1 });
									setPage(page + 1);
								}
							}}
							disabled={!data?.pages[page - 1].hasNext}
							icon={<ChevronRightIcon fontSize={20} />}
							aria-label='Next'
						/>
					</Flex>
				</Box>
			</Box>
		</>
	);
};

export default FindFriendsPage;
