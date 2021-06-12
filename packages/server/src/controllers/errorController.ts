import { NextFunction, Request, Response } from 'express';
import pluralize from 'pluralize';

const handleValidationError = (err: any) => {
	const error: any = {
		errors: {},
	};
	Object.keys(err.errors).forEach((field) => {
		console.log(err.errors[field].message);
		error.errors[field] = err.errors[field].message;
	});
	error.statusCode = 400;
	error.status = 'fail';
	return error;
};

const handleDuplicateKeyError = (err: any) => {
	const error: any = {
		errors: {},
	};
	const schema = pluralize.singular(
		err.message.split('collection: ')[1].split(' ')[0].split('.')[1]
	);
	Object.keys(err.keyValue).forEach((field) => {
		error.errors[field] = `${schema} with this ${field} already exists`;
	});
	error.statusCode = 400;
	error.status = 'fail';
	return error;
};

const sendError = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log(err);

	if (err.errors && err.errors[Object.keys(err.errors)[0]].message) {
		err = handleValidationError(err);
	}

	if (err.code === 11000) {
		err = handleDuplicateKeyError(err);
	}

	res.status(err.statusCode).json({
		err,
	});
};

export default sendError;
