const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const config = require('./config');
const app = require('./app');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.NODE_ENV);

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
