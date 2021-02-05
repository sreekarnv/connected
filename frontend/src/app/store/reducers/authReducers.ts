import { User } from '../../config/types';

import * as actionTypes from '../actionTypes';

type AuthState = {
	user: null | User;

	userInit: boolean;
	userError: any;

	logoutInit: boolean;
	logoutError: null | object;

	userGroups: null;
	userGroupsInit: boolean;
	userGroupsError: null;
};

type AuthActionType = {
	type: string;
	user?: null | User;
	error?: null | object;
	friend?: string;
	groups?: any;
	group?: any;
};

export const initialState = {
	user: null,

	userInit: false,
	userError: null,

	logoutInit: false,
	logoutError: null,

	userGroups: null,
	userGroupsInit: false,
	userGroupsError: null,
};

const reducer = (state: AuthState = initialState, action: AuthActionType) => {
	switch (action.type) {
		case actionTypes.LOGOUT_USER_INIT:
			return {
				...state,
				logoutInit: true,
				logoutError: null,
			};
		case actionTypes.LOGOUT_USER_SUCCESS:
			return {
				...state,
				logoutInit: false,
				user: null,
			};
		case actionTypes.LOGOUT_USER_FAILED:
			return {
				...state,
				logoutInit: false,
				logoutError: action.error,
			};

		case actionTypes.UPDATE_USER_FRIEND_SENT_REQUESTS:
			const user = { ...state.user };
			const requestsSent = [...state.user!.requestsSent];
			requestsSent.push(action.friend!);
			user['requestsSent'] = requestsSent;

			return {
				...state,
				user,
			};

		case actionTypes.GET_USER_GROUPS_INIT:
			return {
				...state,
				userGroupsInit: true,
				userGroupsError: null,
			};

		case actionTypes.GET_USER_GROUPS_SUCCESS:
			return {
				...state,
				userGroupsInit: false,
				userGroups: action.groups,
			};

		case actionTypes.GET_USER_GROUPS_FAILED:
			return {
				...state,
				userGroupsInit: false,
				userGroupsError: action.error,
			};

		case actionTypes.USER_CREATE_NEW_GROUP:
			let newGroups: any = [];
			if (state.userGroups) newGroups = [...state.userGroups!];

			newGroups.push(action.group);

			return {
				...state,
				userGroups: newGroups,
			};

		case actionTypes.USER_UPDATE_GROUP:
			let updateGroup: any = [];
			if (state.userGroups) updateGroup = [...state.userGroups!];

			const index = updateGroup.findIndex((el: any) => {
				return el._id === action.group._id;
			});

			updateGroup[index] = action.group;
			return {
				...state,
				userGroups: updateGroup,
			};

		case actionTypes.UPDATE_USER_INIT:
			return {
				...state,
				userInit: true,
			};

		case actionTypes.UPDATE_USER_SUCCESS:
			return {
				...state,
				user: action.user,
				userInit: false,
			};

		case actionTypes.UPDATE_USER_FAILED:
			return {
				...state,
				userInit: false,
				userError: action.error,
			};

		default:
			return state;
	}
};

export default reducer;
