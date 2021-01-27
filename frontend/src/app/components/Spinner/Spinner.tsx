import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

const Loader = () => {
	return (
		<Box d='flex' alignItems='center' justifyContent='center' h='90vh'>
			<Spinner
				boxSize='100px'
				thickness='6px'
				speed='0.65s'
				emptyColor='gray.200'
				color='primary.600'
			/>
		</Box>
	);
};

export default Loader;
