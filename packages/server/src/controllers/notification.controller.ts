import { NotificationModel } from '../models';
import { ExpressResponse } from '../types';

export const getNotifications: ExpressResponse = async (req, res, next) => {
	try {
		const notifications = await NotificationModel.find({
			receiver: req.user?._id,
		})
			.populate('sender', '_id name photo.url')
			.populate('group', '_id name photo.url')
			.populate('post', '_id name photo.url')
			.select('-__v -receiver')
			.sort({ createdAt: -1 });

		res.status(200).json({
			status: 'success',
			notifications,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteNotification: ExpressResponse = async (req, res, next) => {
	try {
		await NotificationModel.findOneAndDelete({
			$and: [{ _id: req.params._id }, { receiver: req.user?._id }],
		});

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};
