const mongoose = require('mongoose');

const initSockets = (server) => {
	const io = require('socket.io')(server);
	io.on('connection', (socket) => {
		console.log('connected..... websockets');

		socket.on('getGroups', async ({ name, userId }) => {
			let filter = { members: { $ne: userId } };
			if (name) {
				filter = {
					...filter,
					name: { $regex: name },
				};
				name = { $search: name };
				filter['$text'] = name;
			}

			const groups = await mongoose.model('Group').find(filter);
			io.emit(`getGroups-${userId}`, groups);
		});

		socket.on('getPeople', async ({ name, userId, userFriends }) => {
			const userFriendsIds = [];
			userFriends.forEach((el) => userFriendsIds.push(el._id));

			let filter = {
				_id: { $nin: [...userFriendsIds, userId] },
			};

			if (name) {
				let cond = { $regex: name };
				filter = {
					...filter,
					$or: [{ firstName: cond }, { lastName: cond }, { middleName: cond }],
				};
			}

			const users = await mongoose.model('User').find({ ...filter });
			io.emit(`getPeople-${userId}`, users);
		});

		socket.on('disconnect', () => {
			console.log('disconnectedddd.... websockets');
		});
	});

	return io;
};

module.exports = initSockets;
