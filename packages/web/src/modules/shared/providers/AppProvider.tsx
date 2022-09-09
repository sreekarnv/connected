import React from 'react';
import useGetLoggedInUserQuery from '../../auth/hooks/useGetLoggedInUserQuery';
import io from 'socket.io-client';
import Loader from '../components/Loader';
import useGetAllNotificationsQuery from '../../app/hooks/useGetAllNotificationsQuery';
import NotificationSound from '../../../audio/notification.wav';

export const socket = io(process.env.GATSBY_SERVER_URL!, {
	withCredentials: true,
});

interface AppProviderProps {
	children: React.ReactNode;
}

export const AppContext = React.createContext<{
	playSound: () => void;
}>({
	playSound: () => {},
});

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const { isLoading } = useGetLoggedInUserQuery();
	const { isLoading: isNotificationLoading } = useGetAllNotificationsQuery();
	const audioRef = React.useRef<HTMLAudioElement>(null);

	const playSound = () => {
		audioRef.current?.play();
	};

	if (isLoading || isNotificationLoading) {
		return <Loader />;
	}

	return (
		<>
			<audio ref={audioRef} src={NotificationSound} />
			<AppContext.Provider value={{ playSound }}>
				{children}
			</AppContext.Provider>
		</>
	);
};

export default AppProvider;
