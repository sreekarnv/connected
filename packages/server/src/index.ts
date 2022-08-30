import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookie from 'cookie';
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
	handleFriendRequestSent,
	handleFriendRequestAccepted,
} from './sockets';
import { NotifType } from './models/notification.model';
import { verifyToken } from './utils/jwt';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

dotenv.config({ path: path.join(__dirname, '../', '.env') });
console.log(`NODE_ENV=${process.env.NODE_ENV}`);

const PORT = process.env.PORT || 4000;

export const app = express();

app.enable('trust proxy');

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(
	helmet({
		hidePoweredBy: true,
	})
);

app.use(cookieParser());
app.use(express.json());

const server = createServer(app);

const limiter = rateLimit({
	max: 1000,
	windowMs: 30 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});

(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log('Connected to mongodb');
		mongoose.set('debug', true);

		app.use(limiter);

		const io = new Server(server, {
			cors: {
				credentials: true,
				origin: process.env.CORS_ORIGIN,
			},
			cookie: true,
		});

		io.on('connection', (socket) => {
			if (!socket.client.request.headers.cookie) {
				socket.disconnect(true);
				return;
			}

			const cookies = cookie.parse(socket.client.request.headers.cookie);

			if (!cookies['auth.token']) {
				socket.disconnect(true);
				return;
			}

			const payload = verifyToken(cookies['auth.token']) as any;

			if (!payload._id) {
				socket.disconnect(true);
				return;
			}

			socket.on(NotifType.JOIN_GROUP_REQUEST_SENT, (data) => {
				handleGroupJoinRequestSent(io, socket, data);
			});

			socket.on(NotifType.JOIN_GROUP_REQUEST_ACCEPTED, (data) => {
				handleGroupJoinRequestAccepted(io, socket, data);
			});

			socket.on(NotifType.FRIEND_REQUEST_SENT, (data) => {
				handleFriendRequestSent(io, socket, data);
			});

			socket.on(NotifType.FRIEND_REQUEST_ACCEPTED, (data) => {
				handleFriendRequestAccepted(io, socket, data);
			});
		});

		app.use(mongoSanitize());
		app.use(xss());

		app.use('/api/v1/auth', authRouter);
		app.use('/api/v1/users', userRouter);
		app.use('/api/v1/posts', postRouter);
		app.use('/api/v1/groups', groupRouter);
		app.use('/api/v1/comments', commentRouter);
		app.use('/api/v1/notifications', notificationRouter);

		app.use(errorController);

		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
})();
