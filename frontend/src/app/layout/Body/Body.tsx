import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotificationContext } from '../../store/context/NotificationContext';

import Loader from '../../components/Spinner/Spinner';
import NotificationAlert from '../../pages/notifications/NotificationAlert';

const HomeApp = React.lazy(() => import('../../pages/app/HomeApp'));
const Login = React.lazy(() => import('../../pages/auth/Login'));
const Register = React.lazy(() => import('../../pages/auth/Register'));
const Logout = React.lazy(() => import('../../pages/auth/Logout'));
const Home = React.lazy(() => import('../../pages/home/Home'));
const Profile = React.lazy(() => import('../../pages/profile/Profile'));

const Body: React.FC = () => {
	const { notifications } = useContext(NotificationContext);
	const [newNotification, setNewNotification] = useState<Notification | null>(
		null
	);

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

	return (
		<>
			<Suspense fallback={<Loader />}>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>

					<Route exact path='/auth/login'>
						<Login />
					</Route>

					<Route exact path='/auth/register'>
						<Register />
					</Route>

					<Route exact path='/auth/logout'>
						<Logout />
					</Route>

					<Route exact path='/profile'>
						<Profile />
					</Route>

					<Route path='/app'>
						<HomeApp />
					</Route>
				</Switch>
				{newNotification && (
					<NotificationAlert notification={notifications.reverse()[0]} />
				)}
			</Suspense>
		</>
	);
};

export default Body;
