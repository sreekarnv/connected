import CommentModel from '../models/comment.model';
import { ExpressResponse } from '../types';

export const createComment: ExpressResponse = async (req, res, next) => {
	try {
		const { post } = req.query;
		const { content } = req.body;

		const user = req.user?._id;

		const comment = await CommentModel.create({
			content,
			post,
			user,
		});

		res.status(201).json({
			status: 'success',
			comment,
		});
	} catch (err) {
		next(err);
	}
};
