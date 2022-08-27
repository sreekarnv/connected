import { Avatar, Box, Flex, HStack, Text } from '@chakra-ui/react';
import formatDistance from 'date-fns/formatDistance';
import React from 'react';
import { CommentType } from '../../shared/types/api';

interface CommentItemProps {
	comment: CommentType;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
	return (
		<>
			<Box bgColor={'gray.800'} p='5' mb='4' rounded='lg'>
				<Flex mb='3' alignItems='center' justifyContent='space-between'>
					<HStack>
						<Avatar name={comment.user.name} />
						<Text fontWeight='semibold'> {comment.user.name}</Text>
					</HStack>

					<Text>
						{formatDistance(new Date(comment.createdAt), new Date(), {
							addSuffix: true,
						})}
					</Text>
				</Flex>
				<Text color='gray.300'>{comment.content}</Text>
			</Box>
		</>
	);
};

export default CommentItem;
