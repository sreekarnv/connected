import React from 'react';
import { Router } from '@reach/router';
import LoginPage from '../../modules/auth/pages/LoginPage';
import SignupPage from '../../modules/auth/pages/SignupPage';
import LogoutPage from '../../modules/auth/pages/LogoutPage';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<Router basepath='/auth'>
				<LoginPage path='/login' />
				<SignupPage path='/signup' />
				<LogoutPage path='/logout' />
			</Router>
		</>
	);
};

export default App;
