import { Grid, GridItem } from '@chakra-ui/react';
import React, { Suspense, useContext, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Hidden from '../../components/Hidden/Hidden';

import { AuthContext } from '../../store/context/AuthContext';
import ProtectedRoute from '../../utils/ProtectedRoute';

import styles from './homeAppStyles';

const RightSidebar = React.lazy(() => import('./RightSidebar'));
const LeftSidebar = React.lazy(() => import('./LeftSidebar'));
const Group = React.lazy(() => import('./containers/Group'));
const Public = React.lazy(() => import('./containers/Public'));

const FindFriends = React.lazy(() => import('./containers/FindFriends'));
const FindGroups = React.lazy(() => import('./containers/FindGroups'));
const MobileAppBar = React.lazy(() => import('./MobileAppBar'));
const FriendProfile = React.lazy(() => import('./containers/FriendProfile'));
const Loader = React.lazy(() => import('../../components/Spinner/Spinner'));

const HomeApp = () => {
	const route = useRouteMatch();
	const history = useHistory();
	const { getUserGroups } = useContext(AuthContext);

	useEffect(() => {
		getUserGroups();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (route.isExact) {
			return history.replace(`${route.url}/public`);
		}
	});

	return (
		<>
			<Suspense fallback={<Loader />}>
				<Hidden hide={{ lg: true, xl: true }}>
					<MobileAppBar />
				</Hidden>
				<Grid {...styles.container}>
					<GridItem {...styles.leftSidebar}>
						<Hidden hide={{ sm: true, md: true }}>
							<LeftSidebar />
						</Hidden>
					</GridItem>
					<GridItem
						className='hide-scrollbar'
						overflowY='scroll'
						{...styles.content}>
						<ProtectedRoute exact path={`${route.url}/public`}>
							<Public />
						</ProtectedRoute>
						<ProtectedRoute exact path={`${route.url}/groups/:groupId/:slug`}>
							<Group />
						</ProtectedRoute>
						<ProtectedRoute exact path={`${route.url}/find-friends`}>
							<FindFriends />
						</ProtectedRoute>
						<ProtectedRoute exact path={`${route.url}/find-groups`}>
							<FindGroups />
						</ProtectedRoute>
						<ProtectedRoute exact path={`${route.url}/friends/:friendId`}>
							<FriendProfile />
						</ProtectedRoute>
					</GridItem>
					<GridItem {...styles.rightSidebar}>
						<Hidden hide={{ sm: true, md: true }}>
							<RightSidebar />
						</Hidden>
					</GridItem>
				</Grid>
			</Suspense>
		</>
	);
};

export default HomeApp;
