import { Avatar, Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';

interface Post {
	_id: string;
	content: string;
	user: {
		_id: string;
		name: string;
		email: string;
	};
	likes: string[];
	dislikes: string[];
	createdAt: Date;
	updatedAt: Date;
}

interface PostItemProps {
	post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
	return (
		<>
			<Box mb='14'>
				<Flex
					borderWidth='2px'
					borderColor='blue.400'
					borderStyle='solid'
					alignItems='center'
					p='5'
					borderRadius='2xl'
					mb='4'
					justifyContent='space-between'>
					<HStack>
						<Avatar name={post.user.name} />
						<Text>{post.user.name}</Text>
					</HStack>
					<Text>{post.createdAt.toString()}</Text>
				</Flex>
				<Box
					borderWidth='2px'
					borderColor='blue.400'
					borderStyle='solid'
					alignItems='center'
					mb='4'
					p='5'
					borderRadius='2xl'>
					{post.content}
				</Box>
				<Flex
					borderWidth='2px'
					borderColor='blue.400'
					borderStyle='solid'
					alignItems='center'
					p='5'
					borderRadius='2xl'>
					<HStack>
						<Button>Like</Button>
						<Button>Dislike</Button>
					</HStack>
				</Flex>
			</Box>
		</>
	);
};

export default PostItem;
