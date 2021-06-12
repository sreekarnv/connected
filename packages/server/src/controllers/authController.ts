import { ExpressResponse } from '../types';
import UserModel from '../models/userModel';
import * as jwt from './../utils/jwt';
import { AppError, FieldError } from '../utils/errors';

export const registerUser: ExpressResponse = async (req, res, next) => {
	try {
		const { password, name, email, passwordConfirm } = req.body;

		const user = await UserModel.create({
			name,
			email,
			password,
			passwordConfirm,
		});

		user.password = undefined as any;

		jwt.signAtCookie({ _id: user._id }, res);
		jwt.signRtCookie({ _id: user._id }, res);

		res.status(201).json({
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};

export const loginUser: ExpressResponse = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await UserModel.findOne({ email }).select('+password');

		if (!user || !(await user.checkPassword(user.password, password))) {
			return next(
				new FieldError(
					{
						email: 'invalid email',
						password: 'invalid password',
					},
					400
				)
			);
		}

		user.password = undefined as any;

		jwt.signAtCookie({ _id: user._id }, res);
		jwt.signRtCookie({ _id: user._id }, res);

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};

export const logoutUser: ExpressResponse = async (req, res, next) => {
	try {
		res.clearCookie(process.env.COOKIE_AT_NAME!);
		res.clearCookie(process.env.COOKIE_RT_NAME!);
		res.status(200).json({
			status: 'success',
			user: null,
		});
	} catch (err) {
		next(err);
	}
};

export const parseAuthCookie: ExpressResponse = async (req, res, next) => {
	try {
		let payload: any;
		if (
			!req.cookies[process.env.COOKIE_AT_NAME!] &&
			!req.cookies[process.env.COOKIE_RT_NAME!]
		) {
			return next();
		}

		if (
			!req.cookies[process.env.COOKIE_AT_NAME!] &&
			req.cookies[process.env.COOKIE_RT_NAME!]
		) {
			const data = jwt.verifyRtToken(
				req.cookies[process.env.COOKIE_RT_NAME!]
			) as any;

			if (!data) {
				return next();
			}

			const token = jwt.signAtCookie({ _id: data._id }, res);
			req.cookies[process.env.COOKIE_AT_NAME!] = token;
		}

		const data = jwt.verifyAtToken(
			req.cookies[process.env.COOKIE_AT_NAME!]
		) as any;

		if (!data) {
			return next();
		}

		payload = { _id: data._id };

		const user = await UserModel.findOne(payload);

		if (!user) {
			return next();
		}

		req.user = user;

		next();
	} catch (err) {
		next(err);
	}
};

export const protectRoutes: ExpressResponse = async (req, res, next) => {
	if (!req.user) {
		return next(new AppError('You are not logged in', 401));
	}

	next();
};
