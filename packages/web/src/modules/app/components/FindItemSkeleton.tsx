import React from 'react';
import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

interface FindItemSkeletonProps {
	noOfLines?: number;
}

const FindItemSkeleton: React.FC<FindItemSkeletonProps> = ({
	noOfLines = 4,
}) => {
	return (
		<Box
			p={{
				sm: 5,
			}}>
			<Box p='5' boxShadow='lg'>
				<SkeletonCircle size='10' />
				<SkeletonText mt='4' noOfLines={noOfLines} spacing='4' />
			</Box>
		</Box>
	);
};

export default FindItemSkeleton;
