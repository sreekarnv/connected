const mongoose = require('mongoose');

console.log(process.env.NODE_ENV);

const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bbdkv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

module.exports = async () => {
	try {
		const dbConnect = await mongoose.connect(DB, {
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('Connected to DB successfully');
		return dbConnect;
	} catch (err) {
		console.log(`Error Connecting to DB......`);
		console.error(err);
	}
};
