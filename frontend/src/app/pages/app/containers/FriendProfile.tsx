import {
	Avatar,
	Box,
	Button,
	Flex,
	Heading,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../../../components/Spinner/Spinner';
import { AuthContext } from '../../../store/context/AuthContext';

import useAlert from '../../../hooks/useAlert';
import BaseAlert from '../../../components/Alert/BaseAlert';

const FriendProfile: React.FC = () => {
	const { friendId } = useParams() as any;
	const { user, updateUser } = useContext(AuthContext);
	const history = useHistory();
	const { setAlert, isAlertOpen, alertDetails } = useAlert();
	const [userFriend, setUserFriend] = useState<any>(null);
	const { colorMode } = useColorMode();

	useEffect(() => {
		if (user) {
			if (user.friends && user.friends.length === 0) {
				return history.replace('/app/public');
			}
			const userFriends = [...user.friends];

			const friend = userFriends.find((el) => el._id === friendId);

			if (!friend) {
				return history.replace('/app/public');
			}

			setUserFriend(friend);
		}
	}, [history, user, friendId]);

	const unFriend = async () => {
		try {
			const res = await axios({
				url: '/api/v1/users/unfriend',
				method: 'POST',
				data: {
					friend: friendId,
				},
			});

			updateUser(res.data.user);
			setAlert('success', 'You have unfriended this user');

			setTimeout(() => {
				history.replace('/app/public');
			}, 1800);
		} catch (err) {
			setAlert('error', err.response.data.message);
		}
	};

	return (
		<>
			{isAlertOpen && <BaseAlert alertDetails={alertDetails} />}
			<Flex
				mt={6}
				height='85vh'
				bgGradient={
					colorMode === 'light'
						? 'linear(secondary.200, , primary.50)'
						: 'linear(gray.700, gray.700)'
				}
				direction='column'
				alignItems='center'>
				{!userFriend && <Loader />}
				{userFriend && (
					<Flex
						h='100%'
						justifyContent='center'
						direction='column'
						textAlign='center'
						alignItems='center'>
						<Avatar src={userFriend.photo} boxSize='300px' mb={6} />
						<Heading textTransform='capitalize' color='primary.600'>
							{userFriend.fullName}
						</Heading>
						<Box my={10} textAlign='center'>
							<Heading mb={3} color='gray.500' fontSize='xl' fontWeight='400'>
								Email: {userFriend.email}
							</Heading>
							<Text color='gray.600' fontSize='md'>
								Joined on {new Date(userFriend.createdAt).toDateString()}
							</Text>
						</Box>
						<Button onClick={unFriend} colorScheme='primary'>
							UnFriend
						</Button>
					</Flex>
				)}
			</Flex>
		</>
	);
};

export default FriendProfile;
