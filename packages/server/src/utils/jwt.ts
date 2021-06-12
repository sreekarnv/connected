import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const signAccessToken = (payload: { _id: ObjectId }) => {
	const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, {
		expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES!,
	});

	return token;
};

export const signRefreshToken = (payload: { _id: ObjectId }) => {
	const token = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET!, {
		expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES!,
	});

	return token;
};

export const verifyAtToken = (token: string) => {
	const data = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);

	return data;
};

export const verifyRtToken = (token: string) => {
	const data = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);

	console.log(data);

	return data;
};

export const signAtCookie = (payload: { _id: ObjectId }, res: Response) => {
	const token = signAccessToken(payload);
	res.cookie(process.env.COOKIE_AT_NAME!, token, {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge:
			parseInt(process.env.COOKIE_ACCESS_TOKEN_EXPIRES!) * 24 * 60 * 60 * 1000,
	});

	return token;
};

export const signRtCookie = (payload: { _id: ObjectId }, res: Response) => {
	res.cookie(process.env.COOKIE_RT_NAME!, signRefreshToken(payload), {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge:
			parseInt(process.env.COOKIE_REFRESH_TOKEN_EXPIRES!) * 24 * 60 * 60 * 1000,
	});
};

export const clearAtCookie = (res: Response) => {
	res.clearCookie(process.env.COOKIE_AT_NAME!);
};

export const clearrtCookie = (res: Response) => {
	res.clearCookie(process.env.COOKIE_RT_NAME!);
};
