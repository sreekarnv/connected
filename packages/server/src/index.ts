import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorController from './controllers/errorController';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import { connectDb } from './config/db';

const PORT = process.env.PORT! || 5000;

(async () => {
	try {
		await connectDb();

		const app = express();
		app.use(
			cors({
				credentials: true,
				origin: 'http://localhost:3000',
			})
		);

		app.use(cookieParser());
		app.use(express.json());

		app.use(morgan('dev'));
		app.use('/api/users', userRoutes);
		app.use('/api/posts', postRoutes);

		app.use(errorController);

		app.listen(PORT, () => {
			console.log(`App running on port ${PORT}`);
		});
	} catch (err) {
		console.log(err);
	}
})();
