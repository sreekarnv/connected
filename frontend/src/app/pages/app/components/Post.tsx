import {
	Avatar,
	Grid,
	Flex,
	GridItem,
	Text,
	Image,
	IconButton,
	HStack,
	Collapse,
	Button,
	useDisclosure,
	Spinner,
} from '@chakra-ui/react';

import React, { useContext, useState } from 'react';

import axios from 'axios';

import { ReactComponent as LikeIcon } from './../../../../assets/icons/like.svg';
import { ReactComponent as LikeFillIcon } from './../../../../assets/icons/likefill.svg';
import { ReactComponent as DislikeFillIcon } from './../../../../assets/icons/dislikefill.svg';
import { ReactComponent as DislikeIcon } from './../../../../assets/icons/dislike.svg';
import { ReactComponent as CommentIcon } from './../../../../assets/icons/comment.svg';

import { Post as PostProps } from './../../../config/types';
import { AuthContext } from '../../../store/context/AuthContext';
import Comments from './Comments';

import styles from './postStyles';

import useSpinner from './../../../hooks/useSpinner';

interface Props {
	post: PostProps;
	children?: any;
}

const Post: React.FC<Props> = ({ post }) => {
	const { user } = useContext(AuthContext);
	const [showPostContent, setShowPostContent] = useState(false);
	const [noOfComments, setNoOfComments] = useState(
		(post.comments && post.comments.length) || 0
	);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		showSpinner: showLikesSpinner,
		loadSpinner: loadLikesSpinner,
		closeSpinner: closeLikesSpinner,
	} = useSpinner(false);

	const {
		showSpinner: showDislikesSpinner,
		loadSpinner: loadDislikeSpinner,
		closeSpinner: closeDislikeSpinner,
	} = useSpinner(false);

	const likePost = async () => {
		loadLikesSpinner();
		try {
			await axios({
				method: 'PATCH',
				url: `/api/v1/posts/${post._id}/like`,
			});
		} catch (err) {}
		closeLikesSpinner();
	};

	const dislikePost = async () => {
		loadDislikeSpinner();
		try {
			await axios({
				method: 'PATCH',
				url: `/api/v1/posts/${post._id}/dislike`,
			});
		} catch (err) {}
		closeDislikeSpinner();
	};

	return (
		<>
			{post && (
				<Comments
					setNoOfComments={setNoOfComments}
					comments={post && post.comments ? post.comments : []}
					post={post && post._id}
					isOpen={isOpen}
					onClose={onClose}
				/>
			)}
			<Flex id={post && post._id} {...styles.container}>
				<Grid {...styles.contentContainer}>
					<GridItem colStart={1} colEnd={2} rowStart={1} rowEnd={3}>
						<Avatar src={post.user.photo?.url} />
					</GridItem>

					<GridItem colStart={2} colEnd={3} rowStart={1} rowEnd={2}>
						<Text textTransform='capitalize' fontWeight='700'>
							{post.user.firstName}
						</Text>
					</GridItem>

					<GridItem rowStart={2} rowEnd={3}>
						<Collapse startingHeight={75} in={showPostContent}>
							<Text wordBreak={'break-word'}>{post.content}</Text>
						</Collapse>
						{post.content.length > 400 && (
							<Button
								size='sm'
								onClick={() => setShowPostContent(!showPostContent)}
								mt='1rem'>
								Show {showPostContent ? 'Less' : 'More'}
							</Button>
						)}
					</GridItem>

					{post.photo && (
						<GridItem {...styles.photoContainer}>
							<Image {...styles.photo} src={post.photo?.url} />
						</GridItem>
					)}
				</Grid>
				<HStack {...styles.footer}>
					<Flex direction='column' alignItems='center'>
						<IconButton
							variant='text'
							onClick={onOpen}
							aria-label='Search database'
							icon={<CommentIcon style={{ ...styles.footerIcon }} />}
						/>
						<small>{post && noOfComments} comments</small>
					</Flex>

					<Flex direction='column' alignItems='center'>
						{user && !post.likes.includes(user._id) ? (
							<IconButton
								onClick={likePost}
								variant='text'
								aria-label='Search database'
								icon={
									!showLikesSpinner ? (
										<LikeIcon style={{ ...styles.footerIcon }} />
									) : (
										<Spinner color='primary.700' />
									)
								}
							/>
						) : (
							<IconButton
								onClick={likePost}
								variant='text'
								aria-label='Search database'
								icon={
									!showLikesSpinner ? (
										<LikeFillIcon style={{ ...styles.footerIcon }} />
									) : (
										<Spinner color='primary.700' />
									)
								}
							/>
						)}
						<small>{post.likes.length} likes</small>
					</Flex>

					<Flex direction='column' alignItems='center'>
						{user && !post.dislikes.includes(user._id) ? (
							<IconButton
								onClick={dislikePost}
								variant='text'
								aria-label='Search database'
								icon={
									!showDislikesSpinner ? (
										<DislikeIcon style={{ ...styles.footerIcon }} />
									) : (
										<Spinner color='primary.700' />
									)
								}
							/>
						) : (
							<IconButton
								onClick={dislikePost}
								variant='text'
								aria-label='Search database'
								icon={
									!showDislikesSpinner ? (
										<DislikeFillIcon style={{ ...styles.footerIcon }} />
									) : (
										<Spinner color='primary.700' />
									)
								}
							/>
						)}
						<small>{post.dislikes.length} dislikes</small>
					</Flex>
				</HStack>
			</Flex>
		</>
	);
};

export default Post;
