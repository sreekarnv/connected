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
			<Container py='10'>
				<Button mb='5' variant='ghost' as={Link} to='/'>
					Back
				</Button>
				<Heading mb='5'>{heading}</Heading>
				{children}
			</Container>
		</>
	);
};

export default AuthLayout;
