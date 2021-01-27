import { Avatar, Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Comment as CommentType } from '../../../config/types';
import styles from './commentStyles';

interface Props {
	comment: CommentType;
}

const Comment: React.FC<Props> = ({ comment }) => {
	return (
		<Grid {...styles.container}>
			<Avatar {...styles.avatar} />
			<Flex {...styles.userBox}>
				<Heading {...styles.userBoxHeading}>
					{comment.user.fullName ||
						`${comment.user.firstName} ${
							comment.user.middleName ? comment.user.middleName : ''
						} ${comment.user.lastName}`}
				</Heading>
				<Text {...styles.userBoxText}>
					{new Date(comment.createdAt).toDateString()}
				</Text>
			</Flex>
			<Box {...styles.userComment}>{comment.content}</Box>
		</Grid>
	);
};

export default Comment;
