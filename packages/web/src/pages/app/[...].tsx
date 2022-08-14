import React from 'react';
import { Router } from '@reach/router';
import ProfilePage from '../../modules/app/pages/ProfilePage';
import PrivateRoute from '../../modules/shared/components/PrivateRoute';
import FeedPage from '../../modules/app/pages/FeedPage';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<Router basepath='/app'>
				<PrivateRoute path='/feed' component={FeedPage} />
				<PrivateRoute path='/profile' component={ProfilePage} />
			</Router>
		</>
	);
};

export default App;
