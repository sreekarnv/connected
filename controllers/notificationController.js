const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res, next) => {
	try {
		const notifications = await Notification.find({
			show: true,
			sender: { $ne: req.user._id },
			$or: [
				{
					receiver: req.user._id,
				},
				{ receiver: { $eq: [] } },
			],
		})
			.populate('sender')
			.sort('-createdAt');

		res.status(200).json({
			status: 'success',
			notifications,
		});
	} catch (err) {
		next(err);
	}
};

exports.hideNotification = async (req, res, next) => {
	try {
		await Notification.findOneAndUpdate(
			{
				_id: req.body.notificationId,
			},
			{ show: false },
			{ new: true, runValidators: true }
		);

		next();
	} catch (err) {
		next(err);
	}
};

exports.readAllNotifications = async (req, res, next) => {
	try {
		await Notification.updateMany(
			{
				wasRead: false,
				show: true,
				sender: { $ne: req.user._id },
				$or: [
					{
						receiver: req.user._id,
					},
					{ receiver: { $eq: [] } },
				],
			},
			{
				wasRead: true,
			},
			{ new: true, runValidators: true }
		);

		next();
	} catch (err) {
		next(err);
	}
};
