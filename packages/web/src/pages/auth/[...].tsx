import React from 'react';
import { Router } from '@reach/router';
import LoginPage from '../../modules/auth/pages/LoginPage';
import SignupPage from '../../modules/auth/pages/SignupPage';
import LogoutPage from '../../modules/auth/pages/LogoutPage';
import AuthLayout from '../../modules/auth/layouts/AuthLayout';
import BaseLayout from '../../modules/shared/layouts/BaseLayout';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<BaseLayout>
				<Router basepath='/auth'>
					<LoginPage path='/login' />
					<SignupPage path='/signup' />
					<LogoutPage path='/logout' />
				</Router>
			</BaseLayout>
		</>
	);
};

export default App;
