import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Link,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { socket } from '../../shared/providers/AppProvider';
import { NotifType, UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

interface FindFriendItemProps {
	user: UserType;
}

const FindFriendItem: React.FC<FindFriendItemProps> = ({ user }) => {
	const queryClient = useQueryClient();
	const loggedInUser = queryClient.getQueryData([
		RQ.LOGGED_IN_USER_QUERY,
	]) as UserType;
	const [isLoading, setLoading] = React.useState(false);
	const [friendRequestSent, setFriendRequestSent] = React.useState(
		!!user?.requests?.find((r) => r === loggedInUser._id)
	);

	return (
		<>
			<Flex
				flexDir={'column'}
				justifyContent='space-between'
				bg='gray.900'
				p='4'
				transition={'all 0.2s ease-in-out'}
				_hover={{
					// @ts-ignore
					boxShadow: (theme) => `0 0 10px 5px ${theme.colors.blue[600]}`,
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

				<HStack mt='10'>
					<Button
						w='full'
						isLoading={isLoading}
						onClick={() => {
							if (!friendRequestSent) {
								setLoading(true);
								socket.emit(NotifType.FRIEND_REQUEST_SENT, {
									sender: {
										_id: loggedInUser._id,
										name: loggedInUser.name,
										photo: loggedInUser.photo ?? undefined,
									},
									receiver: {
										_id: user._id,
										name: user.name,
										photo: user.photo ?? undefined,
									},
								});
								setLoading(false);
								setFriendRequestSent(true);
							}
						}}
						disabled={friendRequestSent}
						variant='outline'
						colorScheme={friendRequestSent ? 'gray' : 'green'}>
						{friendRequestSent
							? 'Friend Request Sent !!'
							: 'Send Friend Request'}
					</Button>
				</HStack>
			</Flex>
		</>
	);
};

export default FindFriendItem;
