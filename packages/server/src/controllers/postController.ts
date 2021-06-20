import PostModel from '../models/postModel';
import { ExpressResponse } from '../types';
import { AppError } from '../utils/errors';
import {
	removeUndefinedFields,
	removeUnwantedFields,
} from '../utils/filterBody';

const excludeFields = ['likes', 'dislikes'];

export const createPost: ExpressResponse = async (req, res, next) => {
	try {
		const user = req.user!;
		const { content } = req.body;
		await PostModel.create({
			content,
			user,
		});

		res.status(201).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};

export const getAllPosts: ExpressResponse = async (req, res, next) => {
	try {
		const user = req.user!._id;
		let { limit, page } = req.query as any;

		if (!limit) limit = 10;
		if (!page) page = 0;

		const posts = await PostModel.aggregate([
			{
				$sort: { createdAt: -1, _id: 1 },
			},
			{ $skip: parseInt(page) * parseInt(limit) },
			{ $limit: parseInt(limit) + 1 },
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'creator',
				},
			},
			{
				$group: {
					_id: '$_id',
					doc: { $first: '$$ROOT' },
				},
			},
			{ $replaceRoot: { newRoot: '$doc' } },
			{
				$project: {
					createdAt: 1,
					content: 1,
					photo: 1,
					'user._id': { $arrayElemAt: ['$creator._id', 0] },
					'user.name': { $arrayElemAt: ['$creator.name', 0] },
					userDisliked: {
						$in: [user, '$dislikes'],
					},
					userLiked: {
						$in: [user, '$likes'],
					},
					numofLikes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: 0,
						},
					},
					numofDislikes: {
						$cond: {
							if: { $isArray: '$dislikes' },
							then: { $size: '$dislikes' },
							else: 0,
						},
					},
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]);

		res.status(200).json({
			status: 'success',
			results: posts.length - 1,
			hasNext: posts.length === parseInt(limit) + 1,
			posts: posts.slice(0, limit),
		});
	} catch (err) {
		next(err);
	}
};

export const updatePost: ExpressResponse = async (req, res, next) => {
	try {
		const allowedFields = ['content'];
		const { _id } = req.params;
		const user = req.user!._id;

		req.body = removeUndefinedFields(req.body, allowedFields);

		let doc = await PostModel.findOneAndUpdate({ _id, user }, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError('this post does not exist', 404));
		}

		const userVoted = doc.checkUserVoted(user, doc.likes, doc.dislikes);
		let post = { ...(doc as any)._doc, userVoted };
		post = removeUnwantedFields(post, excludeFields);

		res.status(200).json({
			status: 'success',
			post: post,
		});
	} catch (err) {
		next(err);
	}
};

export const deletePost: ExpressResponse = async (req, res, next) => {
	try {
		const user = req.user!._id;
		const { _id } = req.params;
		await PostModel.findOneAndDelete({ _id, user });

		res.status(204).json({});
	} catch (err) {
		next(err);
	}
};

export const votePost: ExpressResponse = async (req, res, next) => {
	const { _id } = req.params;
	const user = req.user!._id;
	const { vote } = req.body;
	let field = vote + 's';
	let otherField = vote === 'like' ? 'dislikes' : 'likes';

	let doc = await PostModel.findOneAndUpdate(
		{ _id, [field]: { $ne: user } },
		{
			$push: { [field]: user },
			$pull: { [otherField]: user },
		},
		{ new: true, runValidators: true }
	);

	if (!doc) {
		doc = await PostModel.findOneAndUpdate(
			{ _id, [field]: { $eq: user } },
			{
				$pull: { [field]: user },
			},
			{ new: true, runValidators: true }
		);

		if (!doc) {
			return next(new AppError('this post does not exist', 404));
		}
	}

	const userVoted = doc.checkUserVoted(user, doc.likes, doc.dislikes);
	let post = { ...(doc as any)._doc, userVoted };
	post = removeUnwantedFields(post, excludeFields);

	res.status(200).json({
		status: 'success',
		updatedPost: post,
	});
};
