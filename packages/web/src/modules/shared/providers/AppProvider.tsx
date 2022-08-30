import React from 'react';
import useGetLoggedInUserQuery from '../../auth/hooks/useGetLoggedInUserQuery';
import io from 'socket.io-client';
import Loader from '../components/Loader';
import useGetAllNotificationsQuery from '../../app/hooks/useGetAllNotificationsQuery';

export const socket = io('http://localhost:4000', { withCredentials: true });

interface AppProviderProps {
	children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const { isLoading } = useGetLoggedInUserQuery();
	const { isLoading: isNotificationLoading } = useGetAllNotificationsQuery();

	if (isLoading || isNotificationLoading) {
		return <Loader />;
	}

	return <>{children}</>;
};

export default AppProvider;
