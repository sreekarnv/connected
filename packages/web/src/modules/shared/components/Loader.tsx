import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = ({}) => {
	return (
		<>
			<Box
				as='div'
				height='100vh'
				display='flex'
				justifyContent='center'
				alignItems='center'>
				<Spinner
					as='div'
					thickness='4px'
					speed='0.65s'
					emptyColor='gray.200'
					color='blue.500'
					size='xl'
				/>
			</Box>
		</>
	);
};

export default Loader;
