import { NextFunction, Request, Response } from 'express';
import { User } from './models/user.model';

export type IRequest = Request & {
	user?: User;
};

export type ExpressResponse = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => any;

export type Context = {
	req: IRequest;
	res: Response;
};
