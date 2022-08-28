import React from 'react';
import AppNavbar from '../../shared/layouts/navigation/AppNavbar';

interface ProfileLayoutProps {
	children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
	return (
		<>
			<AppNavbar />
			<main>{children}</main>
		</>
	);
};

export default ProfileLayout;
