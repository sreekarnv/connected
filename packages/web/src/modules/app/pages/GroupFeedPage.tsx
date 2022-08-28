import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import useGetLoggedInUserQuery from '../../auth/hooks/useGetLoggedInUserQuery';
// import {  } from 'gatsby';
import { socket } from '../../shared/providers/AppProvider';
import { NotificationType, UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import useGetGroupQuery from '../hooks/useGetGroupQuery';

interface GroupFeedPageProps {
	id: string;
}

const GroupFeedPage: React.FC<GroupFeedPageProps> = ({ id }) => {
	const queryClient = useQueryClient();
	const { data } = useGetGroupQuery(id);
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const [notifications, setNotifications] = React.useState<any>();

	React.useEffect(() => {
		if (data?.group && data.group.admin._id === user._id) {
			socket.on(`group-${id}`, (data) => {
				const cachedNotifsQuery = queryClient.getQueryData([
					RQ.GET_ALL_NOTIFICATIONS_QUERY,
				]) as { status: string; notifications: NotificationType[] };
				const cachedNotifs =
					(cachedNotifsQuery.notifications as NotificationType[]) || [];
				const newNotifs = [data, ...cachedNotifs];
				queryClient.setQueryData([RQ.GET_ALL_NOTIFICATIONS_QUERY], {
					status: 'success',
					notifications: newNotifs,
				});
				setNotifications(data);
			});
		}
	}, [data, user]);

	return (
		<>
			<h1>Group Feed Page</h1>
			<pre>{JSON.stringify(notifications, null, 2)}</pre>
		</>
	);
};

export default GroupFeedPage;
