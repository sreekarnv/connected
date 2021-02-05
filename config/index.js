const { dbConfig } = require('./db');
const sockets = require('./socket');
const changeStreams = require('./changeStreams');

module.exports = async (server) => {
	await dbConfig();
	const io = sockets(server);
	changeStreams(io);
};
