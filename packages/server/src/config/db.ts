import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + './../../.env' });

export const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});

		mongoose.set('debug', true);
		console.log('connected to DB Successfully');
	} catch (err) {
		console.log(`Error connecting to db\n`, err);
	}
};
