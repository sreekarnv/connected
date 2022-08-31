import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

interface LoaderProps {
	height?: number | string;
}

const Loader: React.FC<LoaderProps> = ({ height = '100vh' }) => {
	return (
		<>
			<Box
				as='div'
				height={height}
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
