import {
	Box,
	Flex,
	Heading,
	HStack,
	IconButton,
	Tooltip,
	Text,
} from '@chakra-ui/react';
import { User as UserType } from '../../../config/types';

import { ReactComponent as JoinRequestIcon } from './../../../../assets/icons/message.svg';
import { ReactComponent as GroupsIcon } from './../../../../assets/icons/groups.svg';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../../store/context/AuthContext';

import styles from './userItemStyles';

interface Props {
	user: UserType;
}

const UserItem: React.FC<Props> = (props) => {
	const { user } = props;

	const { updateUserRequestsSent, user: authUser } = useContext(AuthContext);

	const sendFriendRequest = async () => {
		try {
			await axios({
				method: 'PATCH',
				url: '/api/v1/users/sendFriendRequest',
				data: {
					friend: user._id,
				},
			});
			updateUserRequestsSent(user._id);
		} catch (err) {}
	};

	return (
		<Flex {...styles.container}>
			<Flex {...styles.userContainer}>
				<Heading {...styles.userContainerHeading}>{user.fullName}</Heading>
				<Text color='#fff'>
					<Box as='span'>{user && user.friends && user.friends.length}</Box>
					<Box ml={2} as='span'>
						friends
					</Box>
				</Text>
			</Flex>
			<HStack spacing={8}>
				{authUser.requestsSent && !authUser.requestsSent.includes(user._id) ? (
					<Tooltip
						placement='left-start'
						label='send friend request'
						{...styles.btnTooltip}>
						<IconButton
							onClick={sendFriendRequest}
							aria-label='send friend request'
							{...styles.btn}
							icon={<JoinRequestIcon fill='#fff' />}
						/>
					</Tooltip>
				) : (
					<Box as='p' color='yellow.300'>
						Request sent
					</Box>
				)}
				<Tooltip
					placement='right-start'
					label='show profile'
					{...styles.btnTooltip}>
					<IconButton
						{...styles.btn}
						aria-label='show profile'
						icon={<GroupsIcon fill='#fff' />}
					/>
				</Tooltip>
			</HStack>
		</Flex>
	);
};

export default UserItem;
