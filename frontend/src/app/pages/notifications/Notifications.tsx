import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	ModalHeader,
	Heading,
	SimpleGrid,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Notification as NotificationType } from '../../config/types';
import { NotificationContext } from '../../store/context/NotificationContext';
import { UIContext } from '../../store/context/UiContext';
import FriendReqNotification from './notificationTypes/FriendReqNotification';
import GroupReqNotification from './notificationTypes/GroupReqNotification';
import PostNotification from './notificationTypes/PostNotification';

const Notifications: React.FC<any> = () => {
	const { isNotificationsOpen, onNotificationsClose } = useContext(UIContext);
	const { notifications } = useContext(NotificationContext);

	return (
		<Modal
			size='full'
			scrollBehavior='inside'
			isOpen={isNotificationsOpen}
			onClose={onNotificationsClose}>
			<ModalOverlay />
			<ModalContent
				className='hide-scrollbar'
				overflowY='scroll'
				minHeight='100vh'>
				<ModalHeader>
					<Heading color='primary.600' size='lg'>
						Notifications
					</Heading>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<SimpleGrid columns={{ sm: 1, lg: 2 }} spacing={8}>
						{notifications &&
							notifications.map((notification: NotificationType) => {
								switch (notification.type) {
									case 'newGroupPost':
										return (
											<PostNotification
												key={notification._id}
												notification={notification}
											/>
										);
									case 'friendRequestSent':
										return (
											<FriendReqNotification
												key={notification._id}
												notification={notification}
											/>
										);
									case 'friendRequestAccepted':
										return (
											<FriendReqNotification
												key={notification._id}
												notification={notification}
											/>
										);
									case 'joinGroupRequestSent':
										return (
											<GroupReqNotification
												key={notification._id}
												notification={notification}
											/>
										);
									case 'joinGroupRequestAccepted':
										return (
											<GroupReqNotification
												key={notification._id}
												notification={notification}
											/>
										);
									default:
										return null;
								}
							})}
					</SimpleGrid>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default Notifications;
