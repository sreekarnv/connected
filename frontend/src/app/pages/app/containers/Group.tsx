import React, { useContext, useEffect, useState } from 'react';
import {
	Avatar,
	Box,
	Flex,
	Heading,
	HStack,
	IconButton,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react';

import Post from '../components/Post';

import {
	Group as GroupProps,
	Post as PostProps,
} from './../../../config/types';
import { SocketContext } from '../../../store/context/SocketContext';

import { useHistory, useParams } from 'react-router-dom';
import PostSkeleton from '../components/PostSkeleton';
import { ReactComponent as GroupIcon } from './../../../../assets/icons/groups.svg';
import { EditIcon } from '@chakra-ui/icons';
import EditGroup from './EditGroup';
import { AuthContext } from '../../../store/context/AuthContext';
import axios from '../../../config/axios';
const Group = () => {
	const io = useContext<any>(SocketContext);
	const { slug } = useParams<any>();
	const { user: authUser } = useContext(AuthContext);
	const history = useHistory();

	const [loading, setLoading] = useState<boolean>(false);
	const [group, setGroup] = useState<null | GroupProps>(null);
	const [groupPosts, setGroupPosts] = useState<PostProps[]>([]);
	const {
		isOpen: isEditGroupOpen,
		onClose: onEditGroupClose,
		onOpen: onEditGroupOpen,
	} = useDisclosure();

	useEffect(() => {
		if (slug) {
			const getGroup = async () => {
				setLoading(true);
				try {
					const res = await axios({
						method: 'GET',
						url: `/api/v1/groups/${slug}`,
					});

					setGroup(res.data.group);
				} catch (err) {}
				setLoading(false);
			};
			getGroup();
		}
	}, [slug]);

	useEffect(() => {
		if (group) {
			if (!group?.members?.includes(authUser._id)) {
				return history.replace('/app/public');
			}
		}

		if (group) {
			const getGroupPosts = async () => {
				setLoading(true);
				try {
					const res = await axios({
						method: 'GET',
						url: `/api/v1/groups/${group._id}/posts`,
					});

					setGroupPosts(res.data.posts);
				} catch (err) {}
				setLoading(false);
			};
			getGroupPosts();
		}
	}, [group, history, authUser._id]);

	useEffect(() => {
		io.on('newPost', (data: PostProps) => {
			setGroupPosts((prevProps: PostProps[]) => {
				const posts = [...prevProps];
				posts.unshift(data);
				return posts;
			});
		});
	}, [io]);

	useEffect(() => {
		io.on('updatedPost', (data: PostProps) => {
			setGroupPosts((prevProps: PostProps[]) => {
				let posts = [...prevProps];
				const postIndex = posts.findIndex((el) => el._id === data._id);
				posts[postIndex] = { ...data };
				return posts;
			});
		});
	}, [io]);

	if (loading) {
		return (
			<>
				{Array(10)
					.fill(0)
					.map((_, i) => {
						return <PostSkeleton key={i} />;
					})}
			</>
		);
	}

	return (
		<>
			{group && (
				<EditGroup
					setGroup={setGroup}
					group={group}
					isOpen={isEditGroupOpen}
					onOpen={onEditGroupOpen}
					onClose={onEditGroupClose}
				/>
			)}
			<Box
				p={{
					md: 10,
					sm: 4,
				}}>
				{group && (
					<Flex alignItems='center' justifyContent='space-between'>
						<HStack spacing={5} mb={10} alignItems='center'>
							<Avatar
								icon={<GroupIcon style={{ height: '3rem' }} />}
								src={group.photo?.url}
								size='lg'
								boxShadow='0 2px 4px rgba(0, 0, 0, .36)'
							/>
							<Heading
								color='primary.700'
								textAlign={{
									md: 'left',
									sm: 'center',
								}}
								textTransform='capitalize'>
								{group.name}
							</Heading>
						</HStack>
						{group && group.admin === authUser._id && (
							<HStack>
								<Tooltip
									aria-label='edit group'
									hasArrow
									label='Edit Group'
									placement='top-start'>
									<IconButton
										onClick={onEditGroupOpen}
										bg='primary.300'
										_hover={{ bg: 'primary.500' }}
										_active={{ bg: 'primary.400' }}
										color='#fff'
										aria-label='Edit Group'
										icon={<EditIcon />}
									/>
								</Tooltip>
							</HStack>
						)}
					</Flex>
				)}
				{groupPosts.map((post: PostProps) => {
					return <Post post={post} key={post._id} />;
				})}
			</Box>
		</>
	);
};

export default Group;
