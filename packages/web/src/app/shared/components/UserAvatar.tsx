import { HStack, Avatar, Text } from '@chakra-ui/react';
import * as React from 'react';

interface UserAvatarProps {
	user: any;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
	return (
		<HStack cursor='pointer' spacing={3} as='nav'>
			<>
				<Avatar size='sm' loading='lazy' name={user?.name} src={user?.photo} />
				<Text textTransform='capitalize' fontSize='lg' color='primary.300'>
					{user?.name}
				</Text>
			</>
		</HStack>
	);
};

export default UserAvatar;
