const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			trim: true,
			required: [true, 'post must have content'],
		},
		photo: {
			name: String,
			publicId: String,
			url: String,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'post must belong to a user'],
		},
		group: {
			type: mongoose.Schema.ObjectId,
			ref: 'Group',
		},
		likes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
		isPublic: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

postSchema.index({ createdAt: -1 });

postSchema.virtual('comments', {
	localField: '_id',
	foreignField: 'post',
	ref: 'Comment',
	options: { sort: { createdAt: -1 } },
});

postSchema.pre(/^find/, function (next) {
	this.populate('user').populate('comments');
	next();
});

postSchema.pre('save', function (next) {
	if (!this.group) this.isPublic = true;

	if (!this.photo) return next();
	this.photo = `uploads/posts/${this.photo}`;

	next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
