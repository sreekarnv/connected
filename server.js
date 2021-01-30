const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const config = require('./config');
const app = require('./app');

console.log(process.env.NODE_ENV);
// console.log({ ...process.env });

const server = app.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}`);
});

config(server);

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION, SHUTTING DOWN......');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('SIGTERM RECEIEVED. Shutting down....');
	server.close(() => {
		console.log('Process terminated...');
	});
});
