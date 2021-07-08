import React, { useCallback, useContext, useEffect, useState } from 'react';

import { SocketContext } from './SocketContext';

import { AuthContext } from './AuthContext';
import { Group, Notification, User } from '../../config/types';
import axios from '../../config/axios';
import { useLocation } from 'react-router-dom';

export const SearchContext = React.createContext<Partial<any>>({});

const SearchContextProvider = ({ children }: any) => {
	const io = useContext(SocketContext);
	const { user, getUserGroups } = useContext<any>(AuthContext);
	const [searchText, setSearchText] = useState<string>('');
	const [groups, setGroups] = useState<Group[]>([]);
	const [people, setPeople] = useState<User[]>([]);
	const [to, setTo] = useState<string>();

	const updateGroup = useCallback(
		(groupId: string) => {
			const newGroups = [...groups];
			const updatedGroups = newGroups.filter((el) => el._id !== groupId);
			setGroups(updatedGroups);
		},
		[groups]
	);

	const updateGroupRequest = (groupId: string, userId: string) => {
		const newUpdatedRequests = [...groups];
		const groupIndex = newUpdatedRequests.findIndex((el) => el._id === groupId);
		newUpdatedRequests[groupIndex].requests?.push(userId);
		setGroups(newUpdatedRequests);
	};

	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname.startsWith('/app') || pathname.startsWith('/profile')) {
			const findGroups = async () => {
				try {
					const res = await axios({
						method: 'GET',
						url: '/api/v1/groups/new',
					});

					setGroups(res.data.groups);
				} catch (err) {}
			};

			findGroups();
		}
	}, [pathname]);

	useEffect(() => {
		if (pathname.startsWith('/app') || pathname.startsWith('/profile')) {
			const findFriends = async () => {
				try {
					const res = await axios({
						method: 'GET',
						url: '/api/v1/users/find-friends',
					});

					setPeople(res.data.users);
				} catch (err) {}
			};

			findFriends();
		}
	}, [pathname]);

	useEffect(() => {
		if (user && to) {
			io.emit(`${to}`, {
				userId: user._id,
				name: searchText,
				userFriends: user.friends,
			});
		}
	}, [searchText, user, io, to]);

	useEffect(() => {
		if (user) {
			io.on(`getGroups-${user._id}`, (data: Group[]) => {
				if (data) {
					setGroups(data);
				}
			});

			io.on(`getPeople-${user._id}`, (data: User[]) => {
				if (data) {
					setPeople(data);
				}
			});
		}
	}, [io, user]);

	useEffect(() => {
		if (user) {
			io.on(`notifications-${user._id}`, (data: Notification) => {
				const newPeople = [...people];
				if (data.type === 'friendRequestAccepted') {
					const updatedPeople = newPeople.filter(
						(el) => el._id !== data.sender._id
					);
					setPeople(updatedPeople);
				}

				if (data.type === 'joinGroupRequestAccepted') {
					updateGroup(data.group._id);
					getUserGroups();
				}
			});
		}
	}, [io, user, people, updateGroup, getUserGroups]);

	const handleSearchTextChange = (value: string, to: string) => {
		setSearchText(value);
		setTo(to);
	};

	return (
		<>
			<SearchContext.Provider
				value={{
					searchText,
					searchGroups: groups,
					searchPeople: people,
					handleSearchTextChange,
					updateGroup,
					updateGroupRequest,
				}}>
				{children}
			</SearchContext.Provider>
		</>
	);
};

export default SearchContextProvider;
