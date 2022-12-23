import React from 'react';
import {
	Box,
	SkeletonCircle,
	SkeletonText,
	useColorMode,
} from '@chakra-ui/react';

interface FindItemSkeletonProps {
	noOfLines?: number;
}

const FindItemSkeleton: React.FC<FindItemSkeletonProps> = ({
	noOfLines = 4,
}) => {
	const { colorMode } = useColorMode();

	return (
		<Box
			p={{
				sm: 5,
			}}>
			<Box p='5' boxShadow='lg'>
				<SkeletonCircle size='10' />
				<SkeletonText
					startColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
					endColor={colorMode === 'dark' ? 'gray.800' : 'gray.200'}
					mt='4'
					noOfLines={noOfLines}
					spacing='4'
				/>
			</Box>
		</Box>
	);
};

export default FindItemSkeleton;
