const User = require('./../models/userModel');
const Notification = require('./../models/notificationModel');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const imageUpload = require('../utils/imageUpload');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');
// const notificationController = require('./notificationController');

///////////////////////////////////////////////////////////////////////
// UPLOAD AND RESIZE USER IMAGE

exports.uploadUserPhoto = imageUpload.single('photo');

exports.resizeUserImage = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const { height, width, x: left, y: top, scaleX, scaleY } = JSON.parse(
		req.body.imageSettings
	);

	req.file.filename = `user-${uuidv4()}.${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.extract({
			left: parseInt(left),
			top: parseInt(top),
			width: parseInt(width),
			height: parseInt(height),
		})
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`uploads/users/${req.file.filename}`);

	next();
};

///////////////////////////////////////////////////////////////////////
// UPDATE USER

exports.filterUserUpdateFilter = (req, res, next) => {
	Object.keys(req.body).forEach((el) => {
		if (el === 'password' || el === 'passwordConfirm') {
			delete req.body[el];
		}
	});
	next();
};

exports.updateCurrentUserData = async (req, res, next) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const user = await User.findOneAndUpdate(
			{ _id: req.user.id },
			{ ...req.body },
			{
				new: true,
				runValidators: true,
				session,
			}
		).populate('friends');

		if (req.file && req.file.filename) {
			user.photo = req.file.filename;
			await user.save({ validateBeforeSave: false, session });
		}

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (err) {
		session.abortTransaction;
		session.endSession();
		next(err);
	}
};

////////////////////////////////////////////////////////////////
// GET CURRENT USER DATA

exports.getCurrentUserData = async (req, res, next) => {
	const user = req.user;

	res.status(200).json({
		status: 'success',
		user,
	});
};
//////////////////////////////////////////////////////////////////
// SEND FRIEND REQUEST

exports.sendFriendRequest = async (req, res, next) => {
	// friend who we want to send the request to (receiver)
	const { friend } = req.body;

	// logged in user (sender)
	const user = req.user.id;

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const updatedFriend = await User.findOneAndUpdate(
			{ _id: friend },
			{ $push: { requestsReceived: user } },
			{ new: true, runValidators: true, session }
		).populate('friends');

		const updatedUser = await User.findOneAndUpdate(
			{ _id: user },
			{ $push: { requestsSent: friend } },
			{ new: true, runValidators: true, session }
		).populate('friends');

		await Notification.create(
			[
				{
					type: 'friendRequestSent',
					sender: req.user._id,
					receiver: [friend],
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			friend: updatedFriend,
			user: updatedUser,
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		next(err);
	}
};

///////////////////////////////////////////////////////////////
// ACCEPT FRIEND REQUEST

exports.acceptFriendRequest = async (req, res, next) => {
	// friend who we sent the request
	const { friend } = req.body;

	// logged in user (sender)
	const user = req.user.id;

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: user, requestsReceived: friend },
			{ $pull: { requestsReceived: friend }, $push: { friends: friend } },
			{ new: true, runValidators: true, session }
		).populate('friends');

		const updatedFriend = await User.findOneAndUpdate(
			{ _id: friend, requestsSent: user },
			{ $pull: { requestsSent: user }, $push: { friends: user } },
			{ new: true, runValidators: true, session }
		);

		if (!updatedUser || !updatedFriend) {
			return next(
				new AppError(
					'you probably did not send a friend request or your friend request was rejected',
					404
				)
			);
		}

		await Notification.create(
			[
				{
					type: 'friendRequestAccepted',
					sender: user,
					receiver: [friend],
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			friend: updatedFriend,
			user: updatedUser,
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		next(err);
	}
};

///////////////////////////////////////////////////////////////
// REJECT FRIEND REQUEST

exports.rejectFriendRequest = async (req, res, next) => {
	// friend who we sent the request
	const { friend } = req.body;

	// logged in user (sender)
	const user = req.user.id;

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: user, requestsReceived: friend },
			{ $pull: { requestsReceived: friend } },
			{ new: true, runValidators: true, session }
		);

		const updatedFriend = await User.findOneAndUpdate(
			{ _id: friend, requestsSent: user },
			{ $pull: { requestsSent: user } },
			{ new: true, runValidators: true, session }
		);

		if (!updatedUser || !updatedFriend) {
			return next(
				new AppError(
					'you probably did not send a friend request or your friend request was rejected',
					404
				)
			);
		}

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			friend: updatedFriend,
			user: updatedUser,
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		next(err);
	}
};

////////////////////////////////////////////////////////////////////////
// GET USER FRIENDS

exports.getUserFriends = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id).populate('friends');

		res.status(200).json({
			status: 'success',
			friends: user.friends,
		});
	} catch (err) {
		next(err);
	}
};

////////////////////////////////////////////////////////////////////////
// GET Not USER FRIENDS

exports.getAllNotUserFriends = async (req, res, next) => {
	try {
		let { name } = { ...req.query };

		let filter = {
			_id: { $nin: [...req.user.friends, req.user._id] },
		};

		if (name) {
			let cond = { $regex: name };
			filter = {
				...filter,
				$or: [{ firstName: cond }, { lastName: cond }, { middleName: cond }],
			};
		}

		const users = await User.find({ ...filter });

		res.status(200).json({
			status: 'success',
			results: users.length,
			users,
		});
	} catch (err) {
		next(err);
	}
};
