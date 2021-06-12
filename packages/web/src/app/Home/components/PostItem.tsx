import {
	Flex,
	Grid,
	GridItem,
	Avatar,
	Collapse,
	Button,
	HStack,
	IconButton,
	Text,
	Image,
	useDisclosure,
	GridProps,
	StackProps,
	GridItemProps,
	ImageProps,
	IconProps,
	Icon,
} from '@chakra-ui/react';
import * as React from 'react';
import CommentIcon from '../../shared/icons/CommentIcon';
import DislikeIcon from '../../shared/icons/DislikeIcon';
import LikeIcon from '../../shared/icons/LikeIcon';
import { Post } from '../../shared/types';

interface PostItemProps {
	post: Post;
}

interface Styles {
	contentContainer: GridProps;
	photoContainer: GridItemProps;
	photo: ImageProps;
	footer: StackProps;
	footerIcon: IconProps;
}

const styles: Styles = {
	contentContainer: {
		columnGap: 8,
		p: 4,
		border: '1px solid',
		borderRadius: '15px',
		borderColor: 'primary.200',
		templateRows: 'max-content max-content 1fr',
		templateColumns: 'max-content 1fr',
	},
	photoContainer: {
		mt: 10,
		colStart: 1,
		colEnd: -1,
		justifySelf: 'center',
		rowStart: 3,
		rowEnd: 4,
	},
	photo: {
		boxSize: '400px',
		h: {
			md: '400px',
			sm: 'auto',
		},
	},
	footer: {
		mt: 3,
		border: '1px solid',
		borderRadius: '15px',
		borderColor: 'primary.200',
		px: 4,
		py: 2,
		justifyContent: {
			md: 'flex-end',
			sm: 'center',
		},
		spacing: 4,
	},
	footerIcon: {
		height: '1.5rem',
		fill: 'dodgerblue',
	},
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
	const { isOpen: showPostContent, onToggle: togglePostContent } =
		useDisclosure();

	return (
		<>
			<Flex flexDir='column' mb='10'>
				<Grid {...styles.contentContainer}>
					<GridItem colStart={1} colEnd={2} rowStart={1} rowEnd={3}>
						<Avatar src={'Yo'} name={post.user.name} />
					</GridItem>

					<GridItem colStart={2} colEnd={3} rowStart={1} rowEnd={2}>
						<Text textTransform='capitalize' fontWeight='700'>
							{post.user.name}
						</Text>
					</GridItem>

					<GridItem rowStart={2} rowEnd={3}>
						<Collapse startingHeight={70} in={showPostContent}>
							{post.content}
						</Collapse>
						{post.content.length > 400 && (
							<Button size='sm' onClick={togglePostContent} mt='1rem'>
								Show {showPostContent ? 'Less' : 'More'}
							</Button>
						)}
					</GridItem>

					{post.photo && (
						<GridItem {...styles.photoContainer}>
							<Image {...styles.photo} src={post.photo} />
						</GridItem>
					)}
				</Grid>
				<HStack {...styles.footer}>
					<Flex direction='column' alignItems='center'>
						<IconButton
							variant='text'
							// onClick={onOpen}
							aria-label='Search database'
							icon={
								<Icon color='primary.500' fontSize='3xl' as={CommentIcon} />
							}
						/>
						<small>0 comments</small>
					</Flex>

					<Flex direction='column' alignItems='center'>
						<IconButton
							variant='text'
							aria-label='Search database'
							icon={
								<Icon
									color={post.userLiked ? 'whiteAlpha.400' : 'primary.500'}
									fontSize='3xl'
									fill={!post.userLiked ? 'transparent' : 'primary.500'}
									as={LikeIcon}
								/>
							}
						/>

						<small>{post.numofLikes} likes</small>
					</Flex>

					<Flex direction='column' alignItems='center'>
						<IconButton
							variant='text'
							aria-label='Search database'
							icon={
								<Icon
									color={post.userDisliked ? 'whiteAlpha.400' : 'primary.500'}
									fill={!post.userDisliked ? 'transparent' : 'primary.500'}
									fontSize='3xl'
									as={DislikeIcon}
								/>
							}
						/>
						<small>{post.numofDislikes} dislikes</small>
					</Flex>
				</HStack>
			</Flex>
		</>
	);
};

export default PostItem;
