const Comment = require('../models/commentModel');

// Get All Post Comments
exports.getAllComments = async (req, res, next) => {
	try {
		const { post } = req.params;
		const comments = await Comment.find({ post }).sort('-createdAt');

		res.status(200).json({
			status: 'success',
			comments,
		});
	} catch (err) {
		next(err);
	}
};

// Get Post Comment
exports.getComment = async (req, res, next) => {
	try {
		const { post, _id } = req.params;
		const comment = await Comment.findOne({ post, _id });

		if (!comment) {
			return next(new AppError('this comment does not exist', 404));
		}

		res.status(200).json({
			status: 'success',
			comment,
		});
	} catch (err) {
		next(err);
	}
};

// create Comment
exports.createComment = async (req, res, next) => {
	try {
		const { post } = req.params;
		const { content } = req.body;

		const user = req.user.id;

		const comment = await Comment.create({
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

////////////////////////////////////////////////////////////////
// LISTENING FOR REAL TIME
