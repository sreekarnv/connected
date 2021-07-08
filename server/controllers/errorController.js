// Duplicate Key Error (Field Already Exists)
const sendDuplicateKeyError = (err, req) => {
	let error = { ...err };
	error.statusCode = 400;
	error.isOperational = true;

	// Creating a user with same email
	if (req.originalUrl === '/api/v1/users/register' && req.method === 'POST') {
		error.message = 'user with that email already exists';
	}

	return error;
};

// JWT Error
const sendJwtError = (err) => {
	let error = { ...err };
	error.message = 'you are not logged in. please login to continue';
	error.statusCode = 401;
	return error;
};

// JWT expired error
const sendTokenExpiredError = (err) => {
	let error = { ...err };
	error.message = 'your session has expired. please login to continue';
	error.statusCode = 401;
	return error;
};

// Handling Cast Errors
const sendCastError = (err) => {
	const message = `Invalid value ${err.value} on path ${err.path}`;
	return new AppError(message, 400);
};

////////////////////////////////////////////////////////////////////
// Prod Error
const sendProdError = (err, req, res) => {
	res.status(err.statusCode || 500).json({
		status: err.status || 'error',
		statusCode: err.statusCode || 500,
		operationalError: err.isOperational,
		message: err.message || 'Something went wrong',
	});
};

////////////////////////////////////////////////////////////////////
// Dev Error

const sendDevError = (err, req, res) => {
	console.log(err);
	res.status(500).json({
		error: err,
	});
};

module.exports = (err, req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		sendDevError(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };

		if (err.code === 11000) error = sendDuplicateKeyError(err, req);
		if (err.name === 'JsonWebTokenError') error = sendJwtError(err);
		if (err.name === 'TokenExpiredError') error = sendTokenExpiredError(err);
		if (err.name === 'CastError') error = sendCastError(err);
		if (err.name === 'ValidationError') error = sendDevError(err, req, res);

		sendProdError(error, req, res);
	}
};
