import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

interface UserProfileCardProps {}

const UserProfileCard: React.FC<UserProfileCardProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<>
			<Box
				borderRadius='lg'
				bg='gray.900'
				p='4'
				transition='all 0.2s ease-in-out'
				// @ts-ignore
				boxShadow={(theme) => `0 0 10px 5px ${theme.colors.blue[600]}`}
				_hover={{
					boxShadow: (theme) => `0 0 10px 8px ${theme.colors.blue[600]}`,
				}}>
				<Flex
					mb='8'
					flexDir='column'
					alignItems='center'
					justifyContent='center'>
					<Avatar mb='4' size='2xl' src={user.photo?.url} name={user.name} />
					<Text fontWeight='semibold' fontSize='3xl'>
						{user.name}
					</Text>
				</Flex>

				<VStack>
					<Button
						colorScheme='blue'
						as={Link}
						variant='outline'
						to='/app/profile'
						width='full'>
						My Profile
					</Button>

					<Button
						variant='outline'
						as={Link}
						to='/app/profile/update'
						width='full'>
						Update Profile
					</Button>

					<Divider />
					<Button as={Link} to='/auth/logout' colorScheme='red' width='full'>
						Log Out
					</Button>
				</VStack>
			</Box>
		</>
	);
};

export default UserProfileCard;
