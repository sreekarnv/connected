import React from 'react';
import {
	Drawer,
	DrawerBody,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Textarea,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Button,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import useCreateCommentMutation from '../hooks/useCreateCommentMutation';
import { useQueryClient } from '@tanstack/react-query';
import { RQ } from '../../shared/types/react-query';
import CommentItem from './CommentItem';
import { PostType } from '../../shared/types/api';

interface CommentDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	comments: any;
	postId: string;
	pageParam: number;
}

const validationSchema = Yup.object()
	.shape({
		content: Yup.string().required('This is a required field').trim(),
	})
	.required();

const CommentDrawer: React.FC<CommentDrawerProps> = ({
	isOpen,
	onClose,
	comments,
	postId,
	pageParam,
}) => {
	const [tabIndex, setTabIndex] = React.useState(0);

	const queryClient = useQueryClient();

	const { isLoading, mutate } = useCreateCommentMutation(postId, {
		onSuccess: (data) => {
			const postsQuery = queryClient.getQueryData([
				RQ.GET_ALL_POSTS_QUERY,
			]) as any;

			const posts = postsQuery.pages[pageParam - 1].posts;

			let newPost = posts.find((post: PostType) => post._id === data.post);
			newPost.comments = [data, ...newPost.comments];

			const updatedPosts = posts.map((post: PostType) => {
				if (post._id === data.post) {
					return newPost;
				}
				return post;
			});

			const updatedPages = postsQuery.pages
				.map((page: any) => {
					if (page.page === pageParam) {
						return {
							...page,
							posts: updatedPosts,
						};
					}
					return page;
				})
				.filter((page: any) => page.posts.length > 0);

			queryClient.setQueryData([RQ.GET_ALL_POSTS_QUERY], {
				pages: updatedPages,
				pageParams: postsQuery.pageParams,
			});

			setTabIndex(0);
			onClose();
		},
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const handleTabsChange = (index: number) => {
		setTabIndex(index);
	};

	const onSubmit = (values: FieldValues) => {
		mutate({
			content: values.content,
		});

		reset();
	};
	return (
		<>
			<Drawer isOpen={isOpen} size='xl' placement='right' onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />

					<Tabs
						index={tabIndex}
						onChange={handleTabsChange}
						variant='soft-rounded'
						pt='4'
						px='3'>
						<TabList>
							<Tab>Comments</Tab>
							<Tab>Add Comment</Tab>
						</TabList>

						<TabPanels>
							<TabPanel>
								<DrawerBody>
									{comments.map((comment: any) => (
										<CommentItem {...{ comment }} key={comment._id} />
									))}
								</DrawerBody>
							</TabPanel>
							<TabPanel>
								<DrawerBody>
									<form noValidate onSubmit={handleSubmit(onSubmit)}>
										<FormControl isRequired isInvalid={!!errors.content}>
											<FormLabel>Content</FormLabel>
											<Textarea {...register('content')} />
											<FormErrorMessage>
												{errors.content?.message as string}
											</FormErrorMessage>
										</FormControl>

										<Button
											isLoading={isLoading}
											colorScheme='blue'
											mt='4'
											type='submit'>
											Submit
										</Button>
									</form>
								</DrawerBody>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default CommentDrawer;
