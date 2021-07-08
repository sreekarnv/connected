const mongoose = require('mongoose');

const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bbdkv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

exports.dbConfig = async () => {
	try {
		const dbConnect = await mongoose.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});

		console.log('Connected to DB successfully');
		return dbConnect;
	} catch (err) {
		console.log(`Error Connecting to DB......`);
		console.error(err);
	}
};

exports.gfs;
