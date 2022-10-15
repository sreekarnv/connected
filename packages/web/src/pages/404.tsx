import { Box, Button, Heading, Image } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import BaseLayout from '../modules/shared/layouts/BaseLayout';
import { UserType } from '../modules/shared/types/api';
import { RQ } from '../modules/shared/types/react-query';
import NotFoundImage from '../images/not-found.svg';

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<BaseLayout>
			<Box textAlign='center' py='10'>
				<Heading mb='3'>Page Not Found | 404</Heading>
				<Image
					height={'100%'}
					width={{ base: '350px', sm: '100%', md: '800px' }}
					margin={'0 auto'}
					src={NotFoundImage}
					alt='Not Found'
				/>
				<Button colorScheme='blue' as={Link} to={user ? '/app/feed' : '/'}>
					Back To Home
				</Button>
			</Box>
		</BaseLayout>
	);
};

export default NotFoundPage;
