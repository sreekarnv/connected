import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import debounce from 'lodash/debounce';
import { GroupType } from '../../shared/types/api';
import FindGroupItem from '../components/FindGroupItem';
import useGetAllGroupsQuery from '../hooks/useGetAllGroupsQuery';
import FindItemSkeleton from '../components/FindItemSkeleton';
import { Link } from 'gatsby';

interface MyGroupsPageProps {}

const MyGroupsPage: React.FC<MyGroupsPageProps> = ({}) => {
	const [search, setSearch] = React.useState('');
	const { data, isLoading } = useGetAllGroupsQuery(search, 'groups-joined');
	const { colorMode } = useColorMode();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
				{Array(3)
					.fill(0)
					.map((_, index) => (
						<FindItemSkeleton key={index} />
					))}
			</>
		);
	}

	return (
		<>
			{!!data?.pages?.[0]?.page?.groups.length && (
				<Box>
					<InputGroup>
						<InputLeftElement pointerEvents='none' children={<SearchIcon />} />
						<Input
							placeholder='Search by name'
							onChange={handleDebouncedSearch}
						/>
					</InputGroup>
					<Box mt='5'>
						{data?.pages.map((page) => {
							return page?.groups.map((group: GroupType) => (
								<FindGroupItem key={group._id} group={group} />
							));
						})}
					</Box>
				</Box>
			)}

			{!data?.pages?.[0]?.page?.groups.length && (
				<Box pt='6' textAlign='center'>
					<Text
						textAlign='center'
						fontWeight='semibold'
						color={colorMode === 'dark' ? 'red.400' : 'red.600'}
						fontSize='3xl'
						lineHeight={1}
						mb='6'>
						You are not a member of any groups yet.
					</Text>
					<Button as={Link} to='/app/groups/find' colorScheme='blue'>
						Find Groups
					</Button>
				</Box>
			)}
		</>
	);
};

export default MyGroupsPage;
