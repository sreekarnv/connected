import { Container } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';
import useGetLoggedInUserQuery from '../../auth/hooks/useGetLoggedInUserQuery';

interface ProfilePageProps {
	path?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({}) => {
	const { data } = useGetLoggedInUserQuery();

	return (
		<>
			<Container>
				<Link to='/'>Back</Link>
				<h1>This is the profile page </h1>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</Container>
		</>
	);
};

export default ProfilePage;
