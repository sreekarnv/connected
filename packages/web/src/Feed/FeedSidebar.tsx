import { Box, Heading } from '@chakra-ui/react';
import * as React from 'react';

interface FeedSidebarProps {}

const FeedSidebar: React.FC<FeedSidebarProps> = ({}) => {
	return (
		<>
			<Box bg='gray.900'>
				<Heading>Left Sidebar</Heading>
			</Box>
		</>
	);
};

export default FeedSidebar;
