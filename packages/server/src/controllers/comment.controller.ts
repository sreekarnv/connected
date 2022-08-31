import { CommentModel } from '../models';
import { ExpressResponse } from '../types';

export const createComment: ExpressResponse = async (req, res, next) => {
	try {
		const { post } = req.query;
		const { content } = req.body;

		let commentQuery = await CommentModel.create({
			content,
			post,
			user: req.user?._id,
		});

		const comment = {
			...(commentQuery as any)._doc,
			user: {
				_id: req.user!._id,
				name: req.user!.name,
				email: req.user!.email,
			},
		};

		res.status(201).json({
			status: 'success',
			comment,
		});
	} catch (err) {
		next(err);
	}
};
