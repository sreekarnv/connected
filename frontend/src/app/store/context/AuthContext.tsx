import React, { useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

import reducer, { initialState } from '../reducers/authReducers';
import * as actionTypes from '../actionTypes';

import { Group as GroupTypes, User } from './../../config/types';

export const AuthContext = React.createContext<Partial<any>>(initialState);

const AuthContextProvider = ({ children }: any) => {
	const [authState, dispatch] = React.useReducer<React.Reducer<any, any>>(
		reducer,
		initialState
	);

	const checkUserExists = useCallback(async () => {
		dispatch({ type: actionTypes.UPDATE_USER_INIT });
		try {
			const res: AxiosResponse = await axios({
				url: '/api/v1/users/checkAuth',
				method: 'GET',
			});

			dispatch({
				type: actionTypes.UPDATE_USER_SUCCESS,
				user: res.data.user,
			});
		} catch (_) {
			dispatch({
				type: actionTypes.UPDATE_USER_FAILED,
				error: null,
			});
		}
	}, []);

	React.useEffect(() => {
		checkUserExists();
	}, [checkUserExists]);

	const logoutUser: () => void = async () => {
		dispatch({ type: actionTypes.LOGOUT_USER_INIT });
		try {
			await axios({
				url: '/api/v1/users/logout',
				method: 'GET',
			});

			dispatch({ type: actionTypes.LOGOUT_USER_SUCCESS });
		} catch (err) {
			dispatch({
				type: actionTypes.LOGOUT_USER_FAILED,
				error: err.response.data,
			});
		}
	};

	const updateUserRequestsSent = (friend: string) => {
		return dispatch({
			type: actionTypes.UPDATE_USER_FRIEND_SENT_REQUESTS,
			friend,
		});
	};

	const getUserGroups = async () => {
		dispatch({
			type: actionTypes.GET_USER_GROUPS_INIT,
		});
		try {
			const res = await axios({
				url: '/api/v1/users/groups',
				method: 'GET',
			});

			dispatch({
				type: actionTypes.GET_USER_GROUPS_SUCCESS,
				groups: res.data.groups,
			});
		} catch (err) {
			dispatch({
				type: actionTypes.GET_USER_GROUPS_FAILED,
				error: err,
			});
		}
	};

	const userCreateNewGroup = (group: GroupTypes) => {
		dispatch({
			type: actionTypes.USER_CREATE_NEW_GROUP,
			group,
		});
	};

	const updateUser = (user: User) => {
		dispatch({
			type: actionTypes.UPDATE_USER_SUCCESS,
			user,
		});
	};

	const methods = {
		logoutUser,
		updateUserRequestsSent,
		getUserGroups,
		userCreateNewGroup,
		updateUser,
		checkUserExists,
	};

	return (
		<AuthContext.Provider value={{ ...authState, ...methods }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
