import PostModel from '../models/postModel';
import UserModel from '../models/userModel';
import { ExpressResponse } from '../types';

export const deleteUsers: ExpressResponse = async (req, res, next) => {
	try {
		await UserModel.deleteMany({});
		res.status(204).json({});
	} catch (err) {
		console.log(err);
	}
};

export const getAllUsers: ExpressResponse = async (req, res, next) => {
	try {
		const users = await UserModel.find();

		res.status(200).json({
			users,
		});
	} catch (err) {
		console.log(err);
	}
};

export const me: ExpressResponse = async (req, res, next) => {
	const user = req.user;

	res.json({
		status: 'success',
		user,
	});
};
