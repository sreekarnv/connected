class AppError extends Error {
	constructor(message, statusCode) {
		super();

		this.isOperational = true;
		this.message = message;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
	}
}

module.exports = AppError;
