import React from 'react';
import { Router } from '@reach/router';
import PrivateRoute from '../../modules/shared/components/PrivateRoute';
import FeedPage from '../../modules/app/pages/FeedPage';
import CreatePostPage from '../../modules/app/pages/CreatePostPage';
import CreateGroupPage from '../../modules/app/pages/CreateGroupPage';
import FindGroupsPage from '../../modules/app/pages/FindGroupPage';
import FeedLayout from '../../modules/app/layouts/FeedLayout';
import GroupFeedPage from '../../modules/app/pages/GroupFeedPage';
import FindFriendsPage from '../../modules/app/pages/FindFriendsPage';
import MyFriendsPage from '../../modules/app/pages/MyFriendsPage';
import MyGroupsPage from '../../modules/app/pages/MyGroupsPage';
import { HeadFC } from 'gatsby';
import { useSiteMetadata } from '../../modules/shared/hooks/useSiteMetadata';

interface AppProps {}

export const Head: HeadFC = () => {
	const siteData = useSiteMetadata();
	const title = `Dashboard | ${siteData.title}`;

	return (
		<>
			<title>{title}</title>
			<meta name='description' content={siteData.description} />
		</>
	);
};

const App: React.FC<AppProps> = ({}) => {
	return (
		<>
			<FeedLayout>
				<Router basepath='/app'>
					<PrivateRoute path='/feed' component={FeedPage} />
					<PrivateRoute path='/posts/new' component={CreatePostPage} />
					<PrivateRoute path='/groups/new' component={CreateGroupPage} />
					<PrivateRoute path='/groups/find' component={FindGroupsPage} />
					<PrivateRoute path='/groups/me' component={MyGroupsPage} />
					<PrivateRoute path='/groups/:id' component={GroupFeedPage} />
					<PrivateRoute path='/friends/find' component={FindFriendsPage} />
					<PrivateRoute path='/friends/me' component={MyFriendsPage} />
				</Router>
			</FeedLayout>
		</>
	);
};

export default App;
