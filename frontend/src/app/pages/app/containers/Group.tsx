import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Heading, HStack } from '@chakra-ui/react';

import Post from '../components/Post';

import { Post as PostProps } from './../../../config/types';
import { SocketContext } from '../../../store/context/SocketContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostSkeleton from '../components/PostSkeleton';
import { ReactComponent as GroupIcon } from './../../../../assets/icons/groups.svg';

const Group = () => {
	const io = useContext<any>(SocketContext);
	const { slug } = useParams<any>();
	const [loading, setLoading] = useState<boolean>(false);
	const [group, setGroup] = useState<null | any>(null);
	const [groupPosts, setGroupPosts] = useState<PostProps[]>([]);

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
	}, [group]);

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
		<Box
			p={{
				md: 10,
				sm: 4,
			}}>
			{group && (
				<HStack spacing={5} mb={10} alignItems='center'>
					<Avatar
						icon={<GroupIcon style={{ height: '3rem' }} />}
						src={group.photo}
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
			)}
			{groupPosts.map((post: PostProps) => {
				return <Post post={post} key={post._id} />;
			})}
		</Box>
	);
};

export default Group;
