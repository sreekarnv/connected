import React from 'react';
import { Router } from '@reach/router';
import ProfilePage from '../../modules/app/pages/ProfilePage';
import PrivateRoute from '../../modules/shared/components/PrivateRoute';
import FeedPage from '../../modules/app/pages/FeedPage';
import CreatePostPage from '../../modules/app/pages/CreatePostPage';
import CreateGroupPage from '../../modules/app/pages/CreateGroupPage';
import FindGroupsPage from '../../modules/app/pages/FindGroupPage';
import FeedLayout from '../../modules/app/layouts/FeedLayout';
import GroupFeedPage from '../../modules/app/pages/GroupFeedPage';

interface AppProps {}

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<FeedLayout>
				<Router basepath='/app'>
					<PrivateRoute path='/feed' component={FeedPage} />
					<PrivateRoute path='/posts/new' component={CreatePostPage} />
					<PrivateRoute path='/groups/new' component={CreateGroupPage} />
					<PrivateRoute path='/groups/find' component={FindGroupsPage} />
					<PrivateRoute path='/groups/:id' component={GroupFeedPage} />
					<PrivateRoute path='/profile' component={ProfilePage} />
				</Router>
			</FeedLayout>
		</>
	);
};

export default App;
