import React, { useContext, useEffect } from 'react';

import { SocketContext } from './SocketContext';

import reducer, { initialState } from '../reducers/notitficationReducers';
import * as actionTypes from '../actionTypes';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Notification as NotificationType } from './../../config/types';

export const NotificationContext = React.createContext<Partial<any>>(
	initialState
);

const NotificationContextProvider = ({ children }: any) => {
	const io = useContext(SocketContext);

	const { user } = useContext<any>(AuthContext);

	const [notificationState, dispatch] = React.useReducer<
		React.Reducer<any, any>
	>(reducer, initialState);

	useEffect(() => {
		if (user && io) {
			io.on(`notifications-${user._id}`, async (data: NotificationType) => {
				dispatch({
					type: actionTypes.GET_USER_NOTIFICATIONS_SUCCESS,
					notifications: [...notificationState.notifications, data],
				});
			});
		}
	}, [io, user, notificationState]);

	useEffect(() => {
		// Get User Notifications
		if (user) {
			const getUserNotifications = async () => {
				dispatch({ type: actionTypes.GET_USER_NOTIFICATIONS_INIT });
				try {
					const res = await axios({
						method: 'GET',
						url: '/api/v1/notifications',
					});

					dispatch({
						type: actionTypes.GET_USER_NOTIFICATIONS_SUCCESS,
						notifications: res.data.notifications,
					});
				} catch (error) {
					dispatch({ type: actionTypes.GET_USER_NOTIFICATIONS_FAILED, error });
				}
			};

			getUserNotifications();
		}
	}, [user]);

	const removeNotification = (notification: string) => {
		return dispatch({
			type: actionTypes.REMOVE_NOTIFICATION,
			notification,
		});
	};

	const readAllNotifications = async (notification: string) => {
		try {
			const res = await axios({
				method: 'PATCH',
				url: '/api/v1/notifications/markAsRead',
			});

			dispatch({
				type: actionTypes.GET_USER_NOTIFICATIONS_SUCCESS,
				notifications: res.data.notifications,
			});
		} catch (err) {}
	};

	return (
		<>
			<NotificationContext.Provider
				value={{
					...notificationState,
					removeNotification,
					readAllNotifications,
				}}>
				{children}
			</NotificationContext.Provider>
		</>
	);
};

export default NotificationContextProvider;
