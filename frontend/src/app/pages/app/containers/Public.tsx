import { Box } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import { SocketContext } from '../../../store/context/SocketContext';
import Post from '../components/Post';
import PostSkeleton from '../components/PostSkeleton';

import { Post as PostProps } from './../../../config/types';

const Public: React.FC = () => {
	const { loading, serverData, error } = useAxios('/api/v1/posts');
	const [posts, setPosts] = useState<PostProps[]>([]);
	const io = useContext(SocketContext);

	useEffect(() => {
		if (!loading && serverData && serverData.posts.length > 0) {
			setPosts(serverData.posts);
		}
	}, [serverData, loading]);

	useEffect(() => {
		// new post
		io.on('newPost', (data: PostProps) => {
			setPosts((prevProps: PostProps[]) => {
				const posts = [...prevProps];
				posts.unshift(data);
				return posts;
			});
		});

		// update post
		io.on('updatedPost', (data: PostProps) => {
			setPosts((prevProps: PostProps[]) => {
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

	if (error) {
		return <Redirect to='/404' />;
	}

	return (
		<Box
			p={{
				md: 10,
				sm: 4,
			}}>
			{posts &&
				posts.map((post: PostProps) => {
					return <Post post={post} key={post._id} />;
				})}
		</Box>
	);
};

export default Public;
