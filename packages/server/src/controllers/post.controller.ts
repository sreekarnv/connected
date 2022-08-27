import PostModel from '../models/post.model';
import { ExpressResponse } from '../types';
import imageUpload from '../utils/imageUpload';

export const uploadPostImage = imageUpload.single('photo');

export const getAllPosts: ExpressResponse = async (req, res, next) => {
	try {
		const { pageParam } = req.query;
		const limit = 5;

		let page = pageParam ? parseInt(pageParam as string) : 1;

		const posts = await PostModel.find()
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
		const { content } = req.body;

		const photo = req.photo ?? undefined;

		let post = await PostModel.create({
			content,
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
