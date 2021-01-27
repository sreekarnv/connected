import { Notification } from '../../config/types';
import * as actionTypes from '../actionTypes';

interface StateProps {
	notifications: Notification[];
	notificationsInit: boolean;
	notificationsError: null | any;
}

export const initialState: StateProps = {
	notifications: [],
	notificationsInit: false,
	notificationsError: null,
};

const reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		case actionTypes.GET_USER_NOTIFICATIONS_INIT:
			return {
				...state,
				notificationsInit: true,
				notificationsError: null,
			};
		case actionTypes.GET_USER_NOTIFICATIONS_SUCCESS:
			return {
				...state,
				notificationsInit: false,
				notifications: action.notifications,
			};

		case actionTypes.GET_USER_NOTIFICATIONS_FAILED:
			return {
				...state,
				notificationsInit: false,
				notificationsError: action.error,
			};

		case actionTypes.REMOVE_NOTIFICATION:
			let newNotifications = [] as any;
			if (state.notifications && state.notifications.length > 0) {
				newNotifications = [...state.notifications];
			}

			newNotifications = newNotifications.filter(
				(el: any) => el._id !== action.notification
			);

			return {
				...state,
				notifications: newNotifications,
			};

		default:
			return state;
	}
};

export default reducer;
