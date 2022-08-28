import React from 'react';
import useGetLoggedInUserQuery from '../../auth/hooks/useGetLoggedInUserQuery';
import io from 'socket.io-client';

export const socket = io('http://localhost:4000');

interface AppProviderProps {
	children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const { isLoading } = useGetLoggedInUserQuery();

	if (isLoading) {
		return <div>Loading....</div>;
	}

	return <>{children}</>;
};

export default AppProvider;
