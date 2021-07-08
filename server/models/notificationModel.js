const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: [
				'friendRequestSent',
				'friendRequestAccepted',

				'joinGroupRequestSent',
				'joinGroupRequestAccepted',

				'newGroupPost',
			],
			required: [true, 'notification must have a type'],
		},
		sender: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: 'User',
		},
		group: {
			type: mongoose.Schema.ObjectId,
			ref: 'Group',
		},
		receiver: [
			{
				type: mongoose.Schema.ObjectId,
				required: true,
				ref: 'User',
			},
		],
		show: {
			type: Boolean,
			default: true,
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
		},
	},
	{
		timestamps: true,
	}
);

notificationSchema.pre(/^find/, function (next) {
	this.populate('group', 'name _id slug');
	next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
