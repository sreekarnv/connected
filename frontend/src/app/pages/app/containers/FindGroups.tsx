import { Box, Heading } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { SearchContext } from '../../../store/context/SearchContext';
import GroupItem from '../components/GroupItem';

import { Group } from './../../../config/types';
import SearchField from '../../../components/Form/SearchField';

const FindGroups = () => {
	const { searchGroups } = useContext(SearchContext);
	const { handleSearchTextChange, searchText } = useContext(SearchContext);

	return (
		<Box textAlign='center' p={10}>
			<Heading mb={9}>Find Groups</Heading>

			<SearchField
				mb={6}
				searchText={searchText}
				handleSearchTextChange={handleSearchTextChange}
			/>
			{searchGroups &&
				searchGroups.map((group: Group) => {
					return <GroupItem key={group._id} group={group} />;
				})}
		</Box>
	);
};

export default FindGroups;
