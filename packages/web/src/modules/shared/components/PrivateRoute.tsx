import React from 'react';
import { navigate } from 'gatsby';
import { useQueryClient } from '@tanstack/react-query';
import { RQ } from '../types/react-query';

interface PrivateRouteProps {
	component: any;
	location?: Location;
	path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	component: Component,
	location,
	...rest
}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]);

	if (
		!user &&
		location?.pathname !== `/auth/login` &&
		location?.pathname !== `/auth/signup` &&
		location?.pathname !== `/`
	) {
		navigate('/auth/login');
		return null;
	}

	return <Component {...rest} />;
};

export default PrivateRoute;
