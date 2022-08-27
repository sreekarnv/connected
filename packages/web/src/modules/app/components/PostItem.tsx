import {
	Avatar,
	Badge,
	Box,
	Button,
	Collapse,
	Flex,
	HStack,
	Icon,
	IconButton,
	Image,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { PostType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import useDislikePostMutation from '../hooks/useDislikePostMutation';
import useLikePostMutation from '../hooks/useLikePostMutation';
import CommentDrawer from './CommentDrawer';
import formatDistance from 'date-fns/formatDistance';

interface PostItemProps {
	post: PostType;
	pageParam: number;
}

const PostItem: React.FC<PostItemProps> = ({ post, pageParam }) => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as any;
	const [liked, setLiked] = React.useState(post.likes.includes(user._id));
	const [likesLength, setLikesLength] = React.useState(post.likes.length);
	const [disliked, setDisliked] = React.useState(
		post.dislikes.includes(user._id)
	);
	const [dislikesLength, setDislikesLength] = React.useState(
		post.dislikes.length
	);
	const { isOpen: isShow, onToggle } = useDisclosure();

	const { mutate: likePost, isLoading: isLikeLoading } = useLikePostMutation(
		post._id,
		{
			onSuccess: (data) => {
				setLikesLength(data.post.likes.length);
				setLiked(data.post.likes.includes(user._id));
				setDislikesLength(data.post.dislikes.length);
				setDisliked(data.post.dislikes.includes(user._id));
			},
		}
	);

	const { mutate: dislikePost, isLoading: isDislikeLoading } =
		useDislikePostMutation(post._id, {
			onSuccess: (data) => {
				setLikesLength(data.post.likes.length);
				setLiked(data.post.likes.includes(user._id));
				setDislikesLength(data.post.dislikes.length);
				setDisliked(data.post.dislikes.includes(user._id));
			},
		});

	return (
		<>
			<CommentDrawer
				{...{ isOpen, onClose }}
				postId={post._id}
				comments={post.comments}
				pageParam={pageParam}
			/>
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
						<Text fontWeight='semibold' fontSize={{ base: 'md', md: 'xl' }}>
							{post.user.name}
						</Text>
					</HStack>
					<Text
						textAlign={{ base: 'right', sm: 'left' }}
						fontSize={{ base: 'sm', sm: 'md' }}
						color='gray.400'
						fontWeight='semibold'>
						{formatDistance(new Date(post.createdAt), new Date(), {
							addSuffix: true,
						})}
					</Text>
				</Flex>
				<Box
					borderWidth='2px'
					borderColor='blue.400'
					borderStyle='solid'
					alignItems='center'
					mb='4'
					p='5'
					borderRadius='2xl'>
					{post.content.length > 530 ? (
						<>
							<Collapse startingHeight={100} in={isShow}>
								{post.content}
							</Collapse>
							<Button
								size='sm'
								onClick={() => {
									onToggle();
								}}
								mt='1rem'>
								Show {isShow ? 'Less' : 'More'}
							</Button>
						</>
					) : (
						<>{post.content}</>
					)}
					{post.photo && (
						<Flex justifyContent='center' mt='4'>
							<Image boxSize={'100%'} src={post.photo.url} alt={post._id} />
						</Flex>
					)}
				</Box>
				<Flex
					borderWidth='2px'
					borderColor='blue.400'
					borderStyle='solid'
					alignItems='center'
					justifyContent='space-between'
					p='5'
					borderRadius='2xl'>
					<HStack spacing={5}>
						<IconButton
							onClick={() => {
								likePost();
							}}
							isLoading={isLikeLoading}
							variant={liked ? 'solid' : 'outline'}
							colorScheme={liked ? 'green' : 'gray'}
							aria-label='Like Post'
							position='relative'
							icon={
								<Icon
									boxSize='4'
									as={() => (
										<>
											<Badge
												bottom='-10px'
												right='-10px'
												position='absolute'
												variant='solid'
												colorScheme='blue'>
												{likesLength}
											</Badge>
											<Box
												as='svg'
												height='6'
												width='6'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={2}>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'
												/>
											</Box>
										</>
									)}
								/>
							}
						/>

						<IconButton
							onClick={() => {
								dislikePost();
							}}
							isLoading={isDislikeLoading}
							variant={disliked ? 'solid' : 'outline'}
							colorScheme={disliked ? 'red' : 'gray'}
							aria-label='dislike Post'
							position='relative'
							icon={
								<Icon
									boxSize='4'
									as={() => (
										<>
											<Badge
												bottom='-10px'
												right='-10px'
												position='absolute'
												variant='solid'
												colorScheme='blue'>
												{dislikesLength}
											</Badge>

											<Box
												as='svg'
												height='6'
												width='6'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={2}>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5'
												/>
											</Box>
										</>
									)}
								/>
							}
						/>
					</HStack>

					<IconButton
						onClick={() => {
							onOpen();
						}}
						aria-label='Open Comments Drawer'
						position='relative'
						variant='outline'
						icon={
							<Icon
								boxSize='4'
								as={() => (
									<>
										<Badge
											bottom='-10px'
											right='-10px'
											position='absolute'
											variant='solid'
											colorScheme='blue'>
											{post.comments.length}
										</Badge>
										<Box
											as='svg'
											height='5'
											width='5'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											strokeWidth={2}>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
											/>
										</Box>
									</>
								)}
							/>
						}
					/>
				</Flex>
			</Box>
		</>
	);
};

export default PostItem;
