import {
	InputGroup,
	InputRightElement,
	Input,
	InputGroupProps,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import React from 'react';

import { useLocation } from 'react-router-dom';

interface Props extends InputGroupProps {
	searchText: string;
	handleSearchTextChange: any;
}

const SearchField: React.FC<Props> = ({
	searchText,
	handleSearchTextChange,
	...props
}) => {
	const location = useLocation();

	return (
		<InputGroup {...props}>
			<InputRightElement
				pointerEvents='none'
				children={<Search2Icon color='gray.300' />}
			/>
			<Input
				value={searchText}
				onChange={(e) =>
					handleSearchTextChange(
						e.target.value,
						location.pathname.includes('find-groups')
							? 'getGroups'
							: 'getPeople'
					)
				}
				type='text'
				placeholder='Search....'
			/>
		</InputGroup>
	);
};

export default SearchField;
