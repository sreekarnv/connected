import { Box, Heading } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { User as UserType } from '../../../config/types';
import { SearchContext } from '../../../store/context/SearchContext';
import UserItem from '../components/UserItem';

import SearchField from '../../../components/Form/SearchField';

const FindFriends: React.FC = () => {
	const { searchPeople } = useContext(SearchContext);
	const { handleSearchTextChange, searchText } = useContext(SearchContext);

	return (
		<Box textAlign='center' p={10}>
			<Heading mb={9}>Find Friends</Heading>

			<SearchField
				mb={6}
				searchText={searchText}
				handleSearchTextChange={handleSearchTextChange}
			/>
			{searchPeople.map((friend: UserType) => {
				return <UserItem key={friend._id} user={friend} />;
			})}
		</Box>
	);
};

export default FindFriends;
