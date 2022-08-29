import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRouter from './routers/auth.router';
import userRouter from './routers/user.router';
import groupRouter from './routers/group.router';
import commentRouter from './routers/comment.router';
import postRouter from './routers/post.router';
import notificationRouter from './routers/notification.router';

import errorController from './controllers/error.controller';
import {
	handleGroupJoinRequestSent,
	handleGroupJoinRequestAccepted,
} from './web-sockets';
import { NotifType } from './models/notification.model';

dotenv.config({ path: path.join(__dirname, '../', '.env') });

console.log(`NODE_ENV=${process.env.NODE_ENV}`);

const PORT = process.env.PORT || 4000;

export const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		credentials: true,
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	},
});

(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log('Connected to mongodb');
		mongoose.set('debug', true);

		app.use(cookieParser());
		app.use(express.json());

		app.use(
			cors({
				origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
				credentials: true,
			})
		);

		io.on('connection', (socket) => {
			socket.on(NotifType.JOIN_GROUP_REQUEST_SENT, (data) => {
				handleGroupJoinRequestSent(io, socket, data);
			});

			socket.on(NotifType.JOIN_GROUP_REQUEST_ACCEPTED, (data) => {
				handleGroupJoinRequestAccepted(io, socket, data);
			});

			socket.on(NotifType.FRIEND_REQUEST_SENT, (data) => {
				console.log(
					data,
					`${NotifType.FRIEND_REQUEST_SENT} event received from ${socket.id}`
				);
			});

			socket.on(NotifType.FRIEND_REQUEST_ACCEPTED, (data) => {
				console.log(
					data,
					`${NotifType.FRIEND_REQUEST_ACCEPTED} event received from ${socket.id}`
				);
			});
		});

		app.use('/api/v1/auth', authRouter);
		app.use('/api/v1/users', userRouter);
		app.use('/api/v1/posts', postRouter);
		app.use('/api/v1/groups', groupRouter);
		app.use('/api/v1/comments', commentRouter);
		app.use('/api/v1/notifications', notificationRouter);

		app.use(errorController);

		httpServer.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
})();
