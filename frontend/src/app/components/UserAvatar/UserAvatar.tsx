import { HStack, Avatar, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { AuthContext } from '../../store/context/AuthContext';

const UserAvatar = () => {
	const { user } = useContext(AuthContext);

	return (
		<HStack cursor='pointer' spacing={4} as='nav'>
			{user && (
				<>
					<Avatar loading='lazy' name={user.firstName} src={user.photo} />
					<Text
						textTransform='capitalize'
						fontSize='1.2rem'
						color='primary.700'>
						{user.firstName}
					</Text>
				</>
			)}
		</HStack>
	);
};

export default UserAvatar;
