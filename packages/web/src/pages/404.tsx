import { Box, Button, Heading } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import BaseLayout from '../modules/shared/layouts/BaseLayout';
import { UserType } from '../modules/shared/types/api';
import { RQ } from '../modules/shared/types/react-query';

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<BaseLayout>
			<Box textAlign='center' py='20'>
				<Heading mb='8'>Page Not Found | 404</Heading>
				<Button colorScheme='blue' as={Link} to={user ? '/app/feed' : '/'}>
					Back To Home
				</Button>
			</Box>
		</BaseLayout>
	);
};

export default NotFoundPage;
