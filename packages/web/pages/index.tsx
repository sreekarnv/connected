import { Button, Container, Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import { getPosts } from '../src/Post/hooks/api/queries/usePosts';
import { dehydrate } from 'react-query/types/hydration';
import { QueryClient } from 'react-query';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
	return (
		<Container maxWidth='container.sm'>
			<Heading textAlign='center' mb='5' mt='10'>
				To Continue Register or Login
			</Heading>
			<Flex justifyContent='center'>
				<NextLink href='/auth/login'>
					<Button>Login</Button>
				</NextLink>
				<NextLink href='/auth/register'>
					<Button colorScheme='blue' ml='5'>
						Register
					</Button>
				</NextLink>
			</Flex>
		</Container>
	);
};

export default HomePage;
