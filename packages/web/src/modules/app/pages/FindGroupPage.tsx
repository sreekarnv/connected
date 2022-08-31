import { SearchIcon } from '@chakra-ui/icons';
import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import debounce from 'lodash/debounce';
import { GroupType } from '../../shared/types/api';
import FindGroupItem from '../components/FindGroupItem';
import useGetAllGroupsQuery from '../hooks/useGetAllGroupsQuery';
import FindItemSkeleton from '../components/FindItemSkeleton';

interface FindGroupsPageProps {}

const FindGroupsPage: React.FC<FindGroupsPageProps> = ({}) => {
	const [search, setSearch] = React.useState('');
	const { data, isLoading } = useGetAllGroupsQuery(search, 'groups-not-joined');

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
				{Array(6)
					.fill(0)
					.map((_, index) => (
						<FindItemSkeleton key={index} />
					))}
			</>
		);
	}

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
					{data?.pages.map((page) => {
						return page?.groups.map((group: GroupType) => (
							<FindGroupItem key={group._id} group={group} />
						));
					})}
				</Box>
			</Box>
		</>
	);
};

export default FindGroupsPage;
