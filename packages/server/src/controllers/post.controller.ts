import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { FilterQuery } from 'mongoose';
import { GroupModel, PostModel } from '../models';
import { GROUP_TYPE } from '../models/group.model';
import { Post } from '../models/post.model';
import { ExpressResponse } from '../types';
import AppError from '../utils/AppError';
import imageUpload from '../utils/imageUpload';

export const uploadPostImage = imageUpload.single('photo');

export const getAllPosts: ExpressResponse = async (req, res, next) => {
	try {
		const { pageParam, groupId } = req.query;
		const limit = 5;

		let query: FilterQuery<DocumentType<Post, BeAnObject>> = {
			group: {
				$eq: undefined,
			},
		};

		let page = pageParam ? parseInt(pageParam as string) : 1;

		if (groupId) {
			query = { group: groupId };

			const groupQuery = await GroupModel.findOne({
				_id: groupId,
			});

			if (!groupQuery) {
				return next(new AppError('Group not found', 404));
			}

			if (
				groupQuery.groupType === GROUP_TYPE.PRIVATE &&
				!groupQuery.members.includes(req.user?._id)
			) {
				return next(
					new AppError("You don't have permission to access this group", 403)
				);
			}
		}

		const posts = await PostModel.find(query)
			.sort('-createdAt')
			.skip(limit * (page - 1))
			.limit(limit + 1);

		res.status(200).json({
			status: 'success',
			hasNext: posts.length === limit + 1,
			currentPageParam: page,
			posts: posts.slice(0, limit),
		});
	} catch (err) {
		next(err);
	}
};

export const createPost: ExpressResponse = async (req, res, next) => {
	try {
		const { content, group } = req.body;

		const photo = req.photo ?? undefined;

		let post = await PostModel.create({
			content,
			group: group || undefined,
			user: req.user?._id,
			photo,
		});

		res.status(201).json({
			status: 'success',
			post,
		});
	} catch (err) {
		next(err);
	}
};

export const likePost: ExpressResponse = async (req, res, next) => {
	try {
		const user = req.user!._id;
		const { _id } = req.params;

		let post = await PostModel.findOneAndUpdate(
			{
				_id,
				likes: { $ne: user },
			},
			{ $push: { likes: user }, $pull: { dislikes: user } },
			{ new: true, runValidators: true }
		);

		if (!post) {
			post = await PostModel.findOneAndUpdate(
				{
					_id,
					likes: user,
				},
				{ $pull: { likes: user } },
				{ new: true, runValidators: true }
			);
		}

		res.status(200).json({
			status: 'success',
			post,
		});
	} catch (err) {
		next(err);
	}
};

export const dislikePost: ExpressResponse = async (req, res, next) => {
	try {
		const user = req.user!._id;
		const { _id } = req.params;

		let post = await PostModel.findOneAndUpdate(
			{
				_id,
				dislikes: { $ne: user },
			},
			{ $push: { dislikes: user }, $pull: { likes: user } },
			{ new: true, runValidators: true }
		);

		if (!post) {
			post = await PostModel.findOneAndUpdate(
				{
					_id,
					dislikes: user,
				},
				{ $pull: { dislikes: user } },
				{ new: true, runValidators: true }
			);
		}

		res.status(200).json({
			status: 'success',
			post,
		});
	} catch (err) {
		next(err);
	}
};
