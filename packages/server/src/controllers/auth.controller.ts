import { createCookie, verifyToken } from './../utils/jwt';
import { UserModel } from '../models';
import { ExpressResponse } from '../types';
import AppError from '../utils/AppError';

export const protectRoutes: ExpressResponse = async (req, _, next) => {
	if (!req.user?._id) {
		return next(
			new AppError(
				'You are not authorized to access to perform this action',
				401
			)
		);
	}

	next();
};

export const protectRoutesWithoutError: ExpressResponse = async (
	req,
	res,
	next
) => {
	if (!req.user?._id) {
		res.status(204).json({});
		return;
	}

	next();
};

export const parseAuthCookie: ExpressResponse = async (req, _, next) => {
	const token = req.cookies['auth.token'];
	if (!token) return next();

	const data = verifyToken(token) as any;
	if (!data?._id) return next();

	const user = await UserModel.findById(data._id);

	if (!user) return next();

	req.user = user;

	next();
};

export const login: ExpressResponse = async (req, res, next) => {
	try {
		const { password, email } = req.body;

		const user = await UserModel.findOne({
			email,
		}).select('+password');

		if (!user || !(await user.verifyPassword(user.password, password))) {
			throw new Error('Email or Password is incorrect');
		}

		user.password = undefined as any;

		createCookie(user._id, req, res);

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (error) {
		next(error);
	}
};

export const signup: ExpressResponse = async (req, res, next) => {
	try {
		const { email, name, password, passwordConfirm } = req.body;

		const photo = req.photo ?? undefined;

		const user = await UserModel.create({
			name,
			email,
			password,
			passwordConfirm,
			photo,
		});

		createCookie(user._id, req, res);

		user.password = undefined as any;

		res.status(201).json({
			status: 'success',
			user,
		});
	} catch (err: any) {
		err.collection = 'user';
		next(err);
	}
};

export const logout: ExpressResponse = async (req, res) => {
	let secure = false;
	if (process.env.NODE_ENV === 'production') {
		secure =
			req.secure || (req as any).headers('x-forwarded-proto') === 'https';
	}

	res.clearCookie('auth.token', {
		sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
		secure,
		httpOnly: true,
	});

	res.status(200).json({
		status: 'success',
	});
};

export const getLoggedinUser: ExpressResponse = async (req, res, next) => {
	try {
		res.status(200).json({
			status: 'success',
			user: req.user || null,
		});
	} catch (error) {
		next(error);
	}
};
