import {
	Avatar,
	Box,
	Flex,
	Link,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react';
import React from 'react';
import { UserType } from '../../shared/types/api';

interface MyFriendItemProps {
	user: UserType;
}

const MyFriendItem: React.FC<MyFriendItemProps> = ({ user }) => {
	const { colorMode } = useColorMode();

	return (
		<>
			<Flex
				flexDir={'column'}
				justifyContent='space-between'
				bgColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
				p='4'
				transition={'all 0.2s ease-in-out'}
				_hover={{
					// @ts-ignore
					boxShadow: (theme) =>
						`0 0 10px 5px ${
							theme.colors.blue[colorMode === 'light' ? 400 : 600]
						}`,
				}}
				mb='4'
				borderRadius='xl'>
				<VStack spacing={5}>
					<Avatar size='lg' src={user.photo?.url} name={user.name} />
					<Box textAlign='center'>
						<Text
							mb='2'
							textAlign='center'
							fontWeight={'semibold'}
							fontSize='xl'>
							{user.name}
						</Text>
						<Link href={`mailto:${user.email}`} color='blue.500'>
							{user.email}
						</Link>
					</Box>
				</VStack>
			</Flex>
		</>
	);
};

export default MyFriendItem;
