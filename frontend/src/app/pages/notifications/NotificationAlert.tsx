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
				w='max-content'
				pos='absolute'
				bottom='30px'
				minW='500px'
				right='30px'
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
