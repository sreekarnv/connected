import { Text, Flex, Heading, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../store/context/AuthContext';

const Error: React.FC = () => {
	const { user } = useContext(AuthContext);
	const history = useHistory();

	return (
		<Flex
			direction='column'
			minH='65vh'
			alignItems='center'
			justifyContent='center'>
			<Heading color='red.500' mb={6} size='2xl'>
				Oops!! Something went wrong :(
			</Heading>
			<Text mb={10}>Click Below to go back</Text>
			<Button
				leftIcon={<ArrowBackIcon />}
				onClick={() => {
					if (user) {
						history.replace('/app/public');
					} else {
						history.replace('/login');
					}
				}}
				colorScheme='gray'
				variant='outline'>
				Back
			</Button>
		</Flex>
	);
};

export default Error;
