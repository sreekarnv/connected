import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../store/context/AuthContext';

const UnProtectedRoute = ({ children, ...rest }: any) => {
	const { user } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={({ location }) =>
				!user ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/app/public',
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
};

export default UnProtectedRoute;
