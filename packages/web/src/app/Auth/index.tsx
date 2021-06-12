import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
	return (
		<>
			<Switch>
				<Route path='/auth/register'>
					<Register />
				</Route>
				<Route path='/auth/login'>
					<Login />
				</Route>
			</Switch>
		</>
	);
};

export default Auth;
