import React from 'react';
import { Router } from '@reach/router';
import LogoutPage from '../../modules/auth/pages/LogoutPage';
import BaseLayout from '../../modules/shared/layouts/BaseLayout';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<BaseLayout>
				<Router basepath='/auth'>
					<LogoutPage path='/logout' />
				</Router>
			</BaseLayout>
		</>
	);
};

export default App;
