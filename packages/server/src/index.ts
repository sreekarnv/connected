import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import authRouter from './routers/auth.router';
import userRouter from './routers/user.router';
import groupRouter from './routers/group.router';
import commentRouter from './routers/comment.router';
import postRouter from './routers/post.router';
import errorController from './controllers/error.controller';

dotenv.config({ path: path.join(__dirname, '../', '.env') });

console.log(`NODE_ENV=${process.env.NODE_ENV}`);

const PORT = process.env.PORT || 4000;

const app = express();

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

		app.use('/api/v1/auth', authRouter);
		app.use('/api/v1/users', userRouter);
		app.use('/api/v1/posts', postRouter);
		app.use('/api/v1/groups', groupRouter);
		app.use('/api/v1/comments', commentRouter);

		app.use(errorController);

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
})();
