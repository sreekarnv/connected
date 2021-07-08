const mongoose = require('mongoose');

module.exports = (io) => {
	mongoose
		.model('Notification')
		.watch({ fullDocument: 'updateLookup' })
		.on('change', async (data) => {
			if (data.operationType === 'insert') {
				const sender = await mongoose
					.model('User')
					.findOne(data.fullDocument.sender);

				let group;
				if (data.fullDocument.group) {
					group = await mongoose
						.model('Group')
						.findById(data.fullDocument.group, 'name slug');
				}

				const newData = {
					...data.fullDocument,
					sender: sender._doc,
					group,
				};

				console.log(newData);
				console.log(newData.receiver.length);
				console.log(newData.receiver.length > 0);

				if (newData.receiver.length > 0) {
					data.fullDocument.receiver.forEach((el) => {
						io.emit(`notifications-${el}`, newData);
					});
				}
			}
		});

	mongoose
		.model('Post')
		.watch([], { fullDocument: 'updateLookup' })
		.on('change', async (data) => {
			if (data.operationType === 'update') {
				const user = await mongoose
					.model('User')
					.findById(data.fullDocument.user)
					.populate('comments');

				const comments = await mongoose
					.model('Comment')
					.find({ post: data.fullDocument._id });

				const updatedDoc = {
					...data.fullDocument,
					user: user._doc,
					comments,
				};

				io.emit('updatedPost', updatedDoc);
			} else if (data.operationType === 'insert') {
				const user = await mongoose
					.model('User')
					.findById(data.fullDocument.user);
				const updatedDoc = {
					...data.fullDocument,
					user: user._doc,
				};

				io.emit('newPost', updatedDoc);
			}
		});

	mongoose
		.model('Comment')
		.watch([], { fullDocument: 'updateLookup' })
		.on('change', async (data) => {
			if (data.operationType === 'insert') {
				const user = await mongoose
					.model('User')
					.findById(data.fullDocument.user);

				const updatedDoc = {
					...data.fullDocument,
					user: user._doc,
				};

				io.emit(`comment-${data.fullDocument.post}`, updatedDoc);
			}
		});
};
