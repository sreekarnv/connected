import React from 'react';
import { Container } from '@chakra-ui/react';
import { Link } from 'gatsby';
import ProfileLayout from '../../modules/profile/layout/ProfileLayout';
import { Router } from '@reach/router';
import PrivateRoute from '../../modules/shared/components/PrivateRoute';
import ProfilePage from '../../modules/profile/pages/ProfilePage';

interface ProfilePagesProps {}

const ProfilePages: React.FC<ProfilePagesProps> = ({}) => {
	return (
		<>
			<ProfileLayout>
				<Router basepath='/profile'>
					<PrivateRoute path='/' component={ProfilePage} />
				</Router>
			</ProfileLayout>
		</>
	);
};

export default ProfilePages;
