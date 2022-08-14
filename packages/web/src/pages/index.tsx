import React from 'react';
import { HeadFC, Link } from 'gatsby';
import BaseLayout from '../modules/shared/layouts/BaseLayout';
import { Button } from '@chakra-ui/react';
import useLogoutMutation from '../modules/auth/hooks/useLogoutMutation';

export const Head: HeadFC = () => <title>Home</title>;

const IndexPage = () => {
	const { isLoading, mutate } = useLogoutMutation();

	return (
		<BaseLayout>
			<h1 className='bg-primary'>Hello World</h1>

			<div>
				<Link to='/auth/login'>Login</Link>
				<Link to='/auth/signup'>Signup</Link>
				<Link to='/app/profile'>Profile</Link>
				<Link to='/app/feed'>Feed</Link>
				<Button
					colorScheme='red'
					isLoading={isLoading}
					onClick={() => {
						mutate();
					}}>
					Logout
				</Button>
			</div>
		</BaseLayout>
	);
};

export default IndexPage;
