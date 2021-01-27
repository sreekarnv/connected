import React, { useContext } from 'react';
import { Notification } from '../../config/types';
import { Alert, AlertIcon, AlertTitle, IconButton } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { UIContext } from '../../store/context/UiContext';

interface Props {
	notification: Notification;
}

const NotificationAlert: React.FC<Props> = ({ notification }) => {
	const { onNotificationsOpen } = useContext(UIContext);
	if (notification) {
		const { type, sender, group } = notification;

		let message;

		if (type === 'friendRequestAccepted') {
			message = `${sender.firstName} ${sender.lastName} accepted your friend request`;
		} else if (type === 'friendRequestSent') {
			message = `${sender.firstName} ${sender.lastName} sent you a friend request`;
		} else if (type === 'newGroupPost') {
			message = `${sender.firstName} ${sender.lastName} posted in ${group.name}`;
		} else if (type === 'joinGroupRequestSent') {
			message = `${sender.firstName} ${sender.lastName} requested to join ${group.name}`;
		} else {
			message = `you are part of ${group.name}!!`;
		}

		return (
			<Alert
				pos='absolute'
				top={{
					md: 'auto',
					sm: '50px',
				}}
				bottom={{
					lg: '30px',
					md: '100px',
				}}
				maxW={{ md: 'max-content', sm: '100%' }}
				minW={{ md: '500px' }}
				right={{
					md: '30px',
					sm: '0',
				}}
				status='info'
				variant='solid'>
				<AlertIcon />

				<AlertTitle>{message}</AlertTitle>

				<IconButton
					onClick={onNotificationsOpen}
					colorScheme='primary'
					ml={3}
					size='sm'
					aria-label='notifications-goto'
					icon={<ArrowForwardIcon />}
				/>
			</Alert>
		);
	} else {
		return null;
	}
};

export default NotificationAlert;
