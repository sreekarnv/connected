import React from 'react';
import {
	Box,
	SkeletonCircle,
	SkeletonText,
	useColorMode,
} from '@chakra-ui/react';

const PostSkeleton: React.FC = () => {
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
					noOfLines={8}
					spacing='4'
				/>
			</Box>
		</Box>
	);
};

export default PostSkeleton;
