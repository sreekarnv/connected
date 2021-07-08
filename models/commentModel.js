const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: 'string',
			trim: true,
			required: [true, 'comment must have content'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'comment must belong to a user'],
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
			required: [true, 'comment must belong to a post'],
		},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

commentSchema.pre(/^find/, function (next) {
	this.populate('user');
	next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
