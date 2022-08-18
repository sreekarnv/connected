import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Button, Container, Heading } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';

interface AuthLayoutProps {
	children: React.ReactNode;
	heading: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, heading }) => {
	return (
		<>
			<Container py={{ base: '6', md: '10' }} maxWidth={'container.lg'}>
				<Button
					leftIcon={<ChevronLeftIcon />}
					mb={{ md: '5' }}
					variant='ghost'
					colorScheme='blue'
					as={Link}
					to='/'>
					Back
				</Button>
			</Container>
			<Container>
				<Heading mb='5'>{heading}</Heading>
				{children}
			</Container>
		</>
	);
};

export default AuthLayout;
