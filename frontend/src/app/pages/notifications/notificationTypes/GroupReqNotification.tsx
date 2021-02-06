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

const GroupReqNotification: React.FC<Props> = ({ notification }) => {
	const { removeNotification } = useContext(NotificationContext);
	const { user } = useContext(AuthContext);
	const [loadingAgr, setLoadingAgr] = useState(false);
	const [loadingRgr, setLoadingRgr] = useState(false);

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

	const acceptGroupRequest = async () => {
		setLoadingAgr(true);
		try {
			await axios({
				url: `api/v1/groups/${notification.group._id}/acceptGroupJoinRequest`,
				method: 'PATCH',
				data: {
					newMember: notification.sender._id,
				},
			});

			closeNotification();
		} catch (err) {}
		setLoadingAgr(false);
	};

	const rejectGroupRequest = async () => {
		setLoadingRgr(true);
		try {
			await axios({
				url: `api/v1/groups/${user._id}/rejectGroupJoinRequest`,
				method: 'PATCH',
				data: {
					friend: notification.sender._id,
					notificationId: notification._id,
				},
			});

			closeNotification();
		} catch (err) {}
		setLoadingRgr(false);
	};

	return (
		<Box {...styles.container}>
			{notification.type === 'joinGroupRequestAccepted' && (
				<CloseButton {...styles.closebtn} onClick={closeNotification} />
			)}

			<HStack spacing={10}>
				<Avatar size='sm' src={notification.sender.photo?.url} />
				<Box as='span' {...styles.senderName}>
					{notification.sender.firstName}
				</Box>

				<Box textAlign='center' fontSize='1.1rem' color='#fff'>
					{notification.type === 'joinGroupRequestSent'
						? `wants to join ${notification.group.name}`
						: `you are part of ${notification.group.name}!!`}
				</Box>

				{notification.type === 'joinGroupRequestSent' && (
					<Tooltip
						placement='top'
						label='Accept Friend Request'
						aria-label='Accept Friend Request tooltip'
						hasArrow>
						{!loadingAgr ? (
							<IconButton
								onClick={acceptGroupRequest}
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
				{notification.type === 'joinGroupRequestSent' && (
					<Tooltip
						onClick={rejectGroupRequest}
						placement='top'
						label='Reject Group Request'
						aria-label='Reject group Request tooltip'
						hasArrow>
						{!loadingRgr ? (
							<IconButton
								color='red.600'
								{...styles.iconbtn}
								aria-label='reject group request'
								icon={<CloseIcon />}
							/>
						) : (
							<IconButton
								color='red.600'
								{...styles.iconbtn}
								aria-label='reject friend request loading'
								icon={<Spinner />}
							/>
						)}
					</Tooltip>
				)}
			</HStack>
		</Box>
	);
};

export default GroupReqNotification;
