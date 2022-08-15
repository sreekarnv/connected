import React from 'react';
import { HeadFC, Link } from 'gatsby';
import BaseLayout from '../modules/shared/layouts/BaseLayout';
import { Button } from '@chakra-ui/react';
import useLogoutMutation from '../modules/auth/hooks/useLogoutMutation';
import ThemeToggler from '../modules/shared/components/ThemeToggler';

export const Head: HeadFC = () => <title>Home</title>;

const IndexPage = () => {
	const { isLoading, mutate } = useLogoutMutation();

	return (
		<BaseLayout>
			<h1>Hello World</h1>

			<div>
				<Link to='/auth/login'>Login</Link>
				<Link to='/auth/signup'>Signup</Link>
				<Link to='/app/profile'>Profile</Link>
				<Link to='/app/feed'>Feed</Link>
				<Link to='/app/posts/new'>Create Post</Link>

				<Button
					colorScheme='red'
					isLoading={isLoading}
					onClick={() => {
						mutate();
					}}>
					Logout
				</Button>

				<ThemeToggler />
			</div>
		</BaseLayout>
	);
};

export default IndexPage;
