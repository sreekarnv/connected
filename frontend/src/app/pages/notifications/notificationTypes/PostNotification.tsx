import {
	Avatar,
	Box,
	CloseButton,
	Flex,
	Grid,
	IconButton,
	Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import React, { useContext } from 'react';
import { Notification } from '../../../config/types';
import { useHistory } from 'react-router-dom';
import { UIContext } from '../../../store/context/UiContext';
import { NotificationContext } from '../../../store/context/NotificationContext';

import styles from './notificationStyles';

interface Props {
	notification: Notification;
}

const PostNotification: React.FC<Props> = ({ notification }) => {
	const history = useHistory();
	const { onNotificationsClose } = useContext(UIContext);
	const { removeNotification } = useContext(NotificationContext);

	const closeNotification = async () => {
		try {
			await axios({
				method: 'PATCH',
				url: '/api/v1/notifications/hide',
				data: {
					notificationId: notification._id,
				},
			});

			removeNotification(notification._id);
		} catch (_) {}
	};

	const navigateToPost = () => {
		history.push({
			pathname: `/app/groups/${notification.group._id}/${notification.group.slug}`,
			state: notification.group._id,
		});
		onNotificationsClose();
		closeNotification();
	};

	return (
		<Box {...styles.container}>
			<CloseButton onClick={closeNotification} {...styles.closebtn} />
			<Grid
				templateColumns='.5fr 1fr .25fr'
				spacing={4}
				justifyContent='center'
				alignItems='center'>
				<Flex alignItems='center'>
					<Avatar size='sm' src={notification.sender.photo} />
					<Box ml={3} alignSelf='flex-end' as='span' {...styles.senderName}>
						{notification.sender.firstName}&nbsp;
					</Box>
				</Flex>

				<Text color='#fff' fontSize='1.1rem' alignSelf='flex-end'>
					posted something in {notification.group.name}
				</Text>

				<IconButton
					onClick={navigateToPost}
					justifySelf='center'
					mr={3}
					size='sm'
					aria-label='post-goto'
					icon={<ArrowForwardIcon />}
				/>
			</Grid>
		</Box>
	);
};

export default PostNotification;
