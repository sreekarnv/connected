import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types';
import { UpdateQuery } from 'mongoose';
import UserModel, { User } from '../models/user.model';
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

		await user.save({ validateModifiedOnly: true, validateBeforeSave: true });

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};

export const updateUserProfile: ExpressResponse = async (req, res, next) => {
	try {
		const { name, email } = req.body;
		const updates: UpdateQuery<DocumentType<User, BeAnObject>> = {
			name,
			email,
		};

		const photo = req.photo ?? undefined;

		if (photo) {
			updates.photo = photo;
		}

		const user = await UserModel.findByIdAndUpdate(req.user?._id, updates, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return next(new AppError('User not found', 404));
		}

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};
