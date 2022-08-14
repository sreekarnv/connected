import React from 'react';
import { Router } from '@reach/router';
import LoginPage from '../../modules/auth/pages/LoginPage';
import SignupPage from '../../modules/auth/pages/SignupPage';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<Router basepath='/auth'>
				<LoginPage path='/login' />
				<SignupPage path='/signup' />
			</Router>
		</>
	);
};

export default App;
