import { Context } from '../types';
import * as jwt from 'jsonwebtoken';

export const createCookie = (_id: string, res: Context['res']) => {
	const token = jwt.sign(
		{
			_id,
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: '1d',
		}
	);

	res.cookie('auth.token', token, {
		httpOnly: true,
		secure: false,
		sameSite: 'none',
		maxAge: 1000 * 60 * 60 * 24,
	});

	return token;
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, process.env.JWT_SECRET!);
};
