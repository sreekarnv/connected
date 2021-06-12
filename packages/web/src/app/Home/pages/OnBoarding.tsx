import { Button } from '@chakra-ui/button';
import { Box, Container, Flex, Heading } from '@chakra-ui/layout';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface OnBoardingProps {}

const OnBoarding: React.FC<OnBoardingProps> = ({}) => {
	return (
		<>
			<Container maxWidth='container.sm'>
				<Heading textAlign='center' mb='5' mt='10'>
					To Continue Register or Login
				</Heading>
				<Flex justifyContent='center'>
					<Button as={Link} to='/auth/login'>
						Login
					</Button>
					<Button as={Link} to='/auth/register' colorScheme='blue' ml='5'>
						Register
					</Button>
				</Flex>
			</Container>
		</>
	);
};

export default OnBoarding;
