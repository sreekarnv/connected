import { User } from '../models/userModel';
import { NextFunction, Request, Response } from 'express';

export type IRequest = Request & {
	user?: User;
};

export type ExpressResponse = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => Promise<void>;

export type FieldErrorObject = {
	[key: string]: string;
};
