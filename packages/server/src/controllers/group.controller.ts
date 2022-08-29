import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types';
import { FilterQuery } from 'mongoose';
import { Group } from '../models/group.model';
import { GroupModel, NotificationModel } from '../models';
import { ExpressResponse } from '../types';
import AppError from '../utils/AppError';
import imageUpload from '../utils/imageUpload';

export const uploadGroupImage = imageUpload.single('photo');

export const getAllGroups: ExpressResponse = async (req, res, next) => {
	try {
		const { search, pageParam } = req.query;
		const limit = 10;

		let page = pageParam ? parseInt(pageParam as string) : 1;
		let query: FilterQuery<DocumentType<Group, BeAnObject>> = {};

		if (search) {
			query = {
				name: { $regex: search, $options: 'i' },
			};
			query['$text'] = { $search: search as string };
		}

		const groups = await GroupModel.find(query)
			.populate('admin', '_id name photo.url')
			.sort('-createdAt')
			.skip(limit * (page - 1))
			.limit(limit + 1);

		res.status(200).json({
			status: 'success',
			hasNext: groups.length === limit + 1,
			currentPageParam: page,
			groups: groups.slice(0, limit),
		});
	} catch (err) {
		next(err);
	}
};

export const createGroup: ExpressResponse = async (req, res, next) => {
	try {
		const { name, description, groupType } = req.body;
		const photo = req.photo ?? undefined;

		let group = await GroupModel.create({
			name,
			description,
			photo,
			admin: req.user?._id,
			members: [req.user?._id],
			groupType,
		});

		res.status(201).json({
			status: 'success',
			group,
		});
	} catch (err) {
		next(err);
	}
};

export const getGroup: ExpressResponse = async (req, res, next) => {
	try {
		const group = await GroupModel.findById(req.params._id).populate(
			'admin members',
			'_id name photo.url'
		);

		if (!group) {
			return next(new AppError('Group not found', 404));
		}

		res.status(200).json({
			status: 'success',
			group,
		});
	} catch (err) {
		next(err);
	}
};

export const rejectGroupJoinRequest: ExpressResponse = async (
	req,
	res,
	next
) => {
	try {
		const { _id } = req.params;
		const { member, notificationId } = req.body;

		const user = req.user?._id;

		const updatedGroup = await GroupModel.findOneAndUpdate(
			{ $and: [{ _id }, { admin: user }, { requests: member }] },
			{ $pull: { requests: member } },
			{ new: true, runValidators: true }
		);

		if (!updatedGroup) {
			return next(
				new AppError('You are not authorized to perform this action', 403)
			);
		}

		await NotificationModel.findByIdAndDelete(notificationId);

		res.status(200).json({
			status: 'success',
			group: updatedGroup,
		});
	} catch (err) {
		next(err);
	}
};
