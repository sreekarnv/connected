import UserModel from '../models/user.model';
import { ExpressResponse } from '../types';
import AppError from '../utils/AppError';
import imageUpload from '../utils/imageUpload';

export const uploadProfileImage = imageUpload.single('photo');

export const updatePassword: ExpressResponse = async (req, res, next) => {
	try {
		const { password, newPassword, passwordConfirm } = req.body;

		const user = await UserModel.findById(req.user?._id, {
			password: 1,
		});

		if (!user || !(await user.verifyPassword(user.password, password))) {
			return next(new AppError('Invalid credentials', 401));
		}

		user.password = newPassword;
		user.passwordConfirm = passwordConfirm;

		await user.save();

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};
