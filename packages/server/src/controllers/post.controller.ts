import mongoose from 'mongoose';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';
import { ExpressResponse } from '../types';

export const getAllPosts: ExpressResponse = async (req, res, next) => {
	try {
		const { pageParam } = req.query;
		const limit = 2;

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

		let post = await PostModel.create({
			content,
			user: req.user?._id,
		});

		res.status(201).json({
			status: 'success',
			post,
		});
	} catch (err) {
		next(err);
	}
};
