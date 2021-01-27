import {
	Avatar,
	Box,
	CloseButton,
	HStack,
	IconButton,
	Spinner,
	Tooltip,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Notification } from '../../../config/types';

import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { NotificationContext } from '../../../store/context/NotificationContext';
import { AuthContext } from '../../../store/context/AuthContext';

import styles from './notificationStyles';

interface Props {
	notification: Notification;
}

const FriendReqNotification: React.FC<Props> = ({ notification }) => {
	const { removeNotification } = useContext(NotificationContext);
	const { updateUser } = useContext(AuthContext);
	const [loadingAfr, setLoadingAfr] = useState(false);
	const [loadingRfr, setLoadingRfr] = useState(false);

	const closeNotification = async () => {
		removeNotification(notification._id);
		try {
			await axios({
				method: 'PATCH',
				url: '/api/v1/notifications/hide',
				data: {
					notificationId: notification._id,
				},
			});
		} catch (_) {}
	};

	const acceptFriendRequest = async () => {
		setLoadingAfr(true);
		try {
			const res = await axios({
				url: '/api/v1/users/acceptFriendRequest',
				method: 'PATCH',
				data: {
					friend: notification.sender._id,
					notificationId: notification._id,
				},
			});

			const user = {
				...res.data.user,
			};

			updateUser(user);
			removeNotification(notification._id);
		} catch (err) {}
		setLoadingAfr(false);
	};

	const rejectFriendRequest = async () => {
		setLoadingRfr(true);
		try {
			await axios({
				url: '/api/v1/users/rejectFriendRequest',
				method: 'PATCH',
				data: {
					friend: notification.sender._id,
					notificationId: notification._id,
				},
			});

			removeNotification(notification._id);
		} catch (err) {}
		setLoadingRfr(false);
	};

	return (
		<Box {...styles.container}>
			{notification.type === 'friendRequestAccepted' && (
				<CloseButton onClick={closeNotification} {...styles.closebtn} />
			)}

			<HStack spacing={10}>
				<Avatar size='sm' src={notification.sender.photo} />
				<Box as='span' {...styles.senderName}>
					{notification.sender.firstName}
				</Box>

				<Box textAlign='center' fontSize='1.1rem' color='#fff'>
					{notification.type === 'friendRequestSent'
						? 'sent you a friend request'
						: 'accepted your friend request'}
				</Box>

				{notification.type === 'friendRequestSent' && (
					<Tooltip
						placement='top'
						label='Accept Friend Request'
						aria-label='Accept Friend Request tooltip'
						hasArrow>
						{!loadingAfr ? (
							<IconButton
								onClick={acceptFriendRequest}
								color='green.600'
								{...styles.iconbtn}
								aria-label='accept friend request'
								icon={<CheckIcon />}
							/>
						) : (
							<IconButton
								color='green.600'
								{...styles.iconbtn}
								aria-label='accept friend request loading'
								icon={<Spinner />}
							/>
						)}
					</Tooltip>
				)}
				{notification.type === 'friendRequestSent' && (
					<Tooltip
						onClick={rejectFriendRequest}
						placement='top'
						label='Reject Friend Request'
						aria-label='Reject Friend Request tooltip'
						hasArrow>
						{!loadingRfr ? (
							<IconButton
								color='red.600'
								{...styles.iconbtn}
								aria-label='reject friend request'
								icon={<CloseIcon />}
							/>
						) : (
							<IconButton
								color='green.600'
								{...styles.iconbtn}
								aria-label='accept friend request loading'
								icon={<Spinner />}
							/>
						)}
					</Tooltip>
				)}
			</HStack>
		</Box>
	);
};

export default FriendReqNotification;
