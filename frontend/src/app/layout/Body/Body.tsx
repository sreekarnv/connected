import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { NotificationContext } from '../../store/context/NotificationContext';

import Loader from '../../components/Spinner/Spinner';
import NotificationAlert from '../../pages/notifications/NotificationAlert';
import { AuthContext } from '../../store/context/AuthContext';
import ProtectedRoute from '../../utils/ProtectedRoute';
import UnProtectedRoute from '../../utils/UnProtectedRoute';

const HomeApp = React.lazy(() => import('../../pages/app/HomeApp'));
const Login = React.lazy(() => import('../../pages/auth/Login'));
const Register = React.lazy(() => import('../../pages/auth/Register'));
const Logout = React.lazy(() => import('../../pages/auth/Logout'));
const Home = React.lazy(() => import('../../pages/home/Home'));
const Profile = React.lazy(() => import('../../pages/profile/Profile'));
const Error = React.lazy(() => import('./../../pages/error/Error'));

const Body: React.FC = () => {
	const { notifications } = useContext(NotificationContext);
	const [newNotification, setNewNotification] = useState<Notification | null>(
		null
	);

	const { user, userInit } = useContext(AuthContext);

	useEffect(() => {
		if (notifications && notifications.length > 0) {
			setNewNotification(notifications[notifications.length - 1]);
		}
	}, [notifications]);

	useEffect(() => {
		if (newNotification) {
			let timer = setTimeout(() => {
				setNewNotification(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [newNotification]);

	if (userInit) {
		return <Loader />;
	}

	return (
		<>
			<Suspense fallback={<Loader />}>
				<Switch>
					<UnProtectedRoute path='/' exact>
						<Home />
					</UnProtectedRoute>

					<UnProtectedRoute exact path='/auth/login'>
						<Login />
					</UnProtectedRoute>

					<UnProtectedRoute exact path='/auth/register'>
						<Register />
					</UnProtectedRoute>

					<Route exact path='/auth/logout'>
						<Logout />
					</Route>

					<ProtectedRoute user={user} exact path='/profile'>
						<Profile />
					</ProtectedRoute>

					<Route path='/app'>
						<HomeApp />
					</Route>

					<Route exact path='/error'>
						<Error />
					</Route>

					<Redirect to='/error' />
				</Switch>
				{newNotification && (
					<NotificationAlert notification={notifications.reverse()[0]} />
				)}
			</Suspense>
		</>
	);
};

export default Body;
