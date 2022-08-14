import mongoose from 'mongoose';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';
import { ExpressResponse } from '../types';

export const getAllPosts: ExpressResponse = async (req, res, next) => {
	try {
		const { group } = req.params;
		const posts = await PostModel.find({ group }).sort('-createdAt');

		res.status(200).json({
			status: 'success',
			posts,
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
