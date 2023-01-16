import React from 'react';
import useGetLoggedInUserQuery from '../../auth/hooks/useGetLoggedInUserQuery';
import io from 'socket.io-client';
import { navigate } from 'gatsby';
import useGetAllNotificationsQuery from '../../app/hooks/useGetAllNotificationsQuery';
import NotificationSound from '../../../audio/notification.wav';
import Loader from '../components/Loader';

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
	const { isLoading, data } = useGetLoggedInUserQuery();
	useGetAllNotificationsQuery({
		enabled: !isLoading && !!data,
	});
	const audioRef = React.useRef<HTMLAudioElement>(null);
	const hasLoggedInURL =
		typeof window !== 'undefined'
			? window.location.pathname.startsWith('/app') ||
			  window.location.pathname.startsWith('/profile')
			: false;

	const playSound = () => {
		audioRef.current?.play();
	};

	React.useEffect(() => {
		if (!isLoading && data && !hasLoggedInURL) {
			navigate('/app/feed');
		}
	}, [isLoading, data, navigate]);

	if (hasLoggedInURL && isLoading) {
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
