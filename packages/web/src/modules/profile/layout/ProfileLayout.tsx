import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import AppNavbar from '../../shared/layouts/navigation/AppNavbar';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

interface ProfileLayoutProps {
	children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	if (!user) return <>{children}</>;

	return (
		<>
			<AppNavbar />
			<main>{children}</main>
		</>
	);
};

export default ProfileLayout;
