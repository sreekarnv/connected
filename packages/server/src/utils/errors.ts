import { FieldErrorObject } from '../types';

export class AppError extends Error {
	public statusCode!: number;
	public status!: 'error' | 'fail';

	constructor(message: string, statusCode: number) {
		super();
		this.message = message;
		this.statusCode = statusCode;
		this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
	}
}

export class FieldError extends Error {
	public errors!: FieldErrorObject;
	public status!: 'error' | 'fail';
	public statusCode!: number;

	constructor(errors: FieldErrorObject, statusCode: number) {
		super();
		this.errors = errors;
		this.statusCode = statusCode;
		this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
	}
}
