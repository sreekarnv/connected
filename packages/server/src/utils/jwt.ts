import { Context } from '../types';
import * as jwt from 'jsonwebtoken';

export const createCookie = (
	_id: string,
	req: Context['req'],
	res: Context['res']
) => {
	const token = jwt.sign(
		{
			_id,
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: '1d',
		}
	);

	let secure = false;
	if (process.env.NODE_ENV === 'production') {
		secure =
			req.secure || (req as any).headers('x-forwarded-proto') === 'https';
	}

	res.cookie('auth.token', token, {
		sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
		httpOnly: true,
		secure,
		maxAge: 1000 * 60 * 60 * 24,
	});

	return token;
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, process.env.JWT_SECRET!);
};
