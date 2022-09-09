import { useToast } from '@chakra-ui/react';
import React from 'react';

const useDesktopNotifications = () => {
	const [notifPermission, setNotifPermission] = React.useState<
		typeof Notification['permission']
	>(Notification.permission);
	const notifToast = useToast();

	const enableNotifications = () => {
		Notification.requestPermission().then((result) => {
			if (result === 'granted') {
				if (notifPermission === 'granted') {
					notifToast({
						title: 'Notifications are already enabled',
						description:
							"If you want to disable them, you'll have to do it from your browser settings",
						status: 'info',
						duration: 3000,
						isClosable: true,

					});

					return;
				}

				notifToast({
					title: 'Notifications enabled',
					description: 'You will receive notifications for new messages',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			}

			if (result === 'denied') {
				notifToast({
					title: 'Notifications are disabled',
					description: 'You can enable them in your browser settings',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}

			setNotifPermission(result);
		});
	};

	React.useEffect(() => {
		window.onfocus = () => {
			setNotifPermission(Notification.permission);
		};
	}, []);

	return {
		enableNotifications,
		notifPermission,
	};
};

export default useDesktopNotifications;
