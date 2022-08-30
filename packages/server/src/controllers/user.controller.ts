import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types';
import { UpdateQuery, FilterQuery } from 'mongoose';
import { User } from '../models/user.model';
import { NotificationModel, UserModel } from '../models';
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

export const getAllUsers: ExpressResponse = async (req, res, next) => {
	try {
		const { search, pageParam } = req.query;
		const limit = 6;

		let page = pageParam ? parseInt(pageParam as string) : 1;
		let query: FilterQuery<DocumentType<User, BeAnObject>> = {
			_id: { $ne: req.user?._id },
			friends: { $ne: req.user?._id },
		};

		if (search) {
			query = {
				name: { $regex: search, $options: 'i' },
			};
			query['$text'] = { $search: search as string };
		}

		const users = await UserModel.find(query)
			.select('_id name photo.url email requests friends')
			.skip(limit * (page - 1))
			.limit(limit + 1);

		res.status(200).json({
			status: 'success',
			hasNext: users.length === limit + 1,
			currentPageParam: page,
			users: users.slice(0, limit),
		});
	} catch (err) {
		next(err);
	}
};

export const rejectFriendRequest: ExpressResponse = async (req, res, next) => {
	const { friendId, notificationId } = req.body;

	console.log(friendId, notificationId);

	const updatedUser = await UserModel.findOneAndUpdate(
		{ $and: [{ _id: req.user?._id }, { requests: friendId }] },
		{ $pull: { requests: friendId } },
		{ new: true, runValidators: true }
	);

	if (!updatedUser) {
		return next(
			new AppError('You are not authorized to perform this action', 403)
		);
	}

	await NotificationModel.findByIdAndDelete(notificationId);

	res.status(200).json({
		status: 'success',
		user: updatedUser,
	});
};
