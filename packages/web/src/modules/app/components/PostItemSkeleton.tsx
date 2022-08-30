import React from 'react';
import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

const PostSkeleton: React.FC = () => {
	return (
		<Box
			p={{
				sm: 5,
			}}>
			<Box p='5' boxShadow='lg'>
				<SkeletonCircle size='10' />
				<SkeletonText mt='4' noOfLines={8} spacing='4' />
			</Box>
		</Box>
	);
};

export default PostSkeleton;
