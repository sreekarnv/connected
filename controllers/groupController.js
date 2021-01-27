const AppError = require('../utils/AppError');
const mongoose = require('mongoose');
const sharp = require('sharp');
const Group = require('./../models/groupModel');
const Notification = require('./../models/notificationModel');
const { v4: uuidv4 } = require('uuid');

const imageUpload = require('../utils/imageUpload');

exports.uploadGroupPhoto = imageUpload.single('photo');

exports.resizeGroupPhoto = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const { height, width, x: left, y: top } = JSON.parse(req.body.imageSettings);

	req.file.filename = `group-${uuidv4()}.${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.extract({
			left: parseInt(left),
			top: parseInt(top),
			width: parseInt(width),
			height: parseInt(height),
		})
		.resize(5000, 5000)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`uploads/groups/${req.file.filename}`);

	next();
};

///////////////////////////////////////////////////////////////////////
// Get All Groups
exports.getAllGroups = async (req, res, next) => {
	try {
		const groups = await Group.find();

		res.status(200).json({
			status: 'success',
			results: groups.length,
			groups,
		});
	} catch (err) {
		next(err);
	}
};

// Get All User Groups
exports.getAllUserGroups = async (req, res, next) => {
	try {
		const groups = await Group.find({ members: req.user.id });

		res.status(200).json({
			status: 'success',
			results: groups.length,
			groups,
		});
	} catch (err) {
		next(err);
	}
};

////////////////////////////////////////////////////////////////////////////////
// create Comment
exports.createGroup = async (req, res, next) => {
	try {
		if (req.file) req.body.photo = req.file.filename;

		let user;
		if (req.user) user = req.user.id;

		const { name, description, photo } = req.body;

		const group = await Group.create({
			name,
			description,
			photo,
			admin: user,
			members: [user],
		});

		res.status(201).json({
			status: 'success',
			group,
		});
	} catch (err) {
		next(err);
	}
};

////////////////////////////////////////////////////////////////
// Get Group

exports.getGroup = async (req, res, next) => {
	try {
		const group = await Group.findOne({ slug: req.params.slug });
		if (!group) {
			return next(new AppError('group doesnt exist', 404));
		}

		res.status(200).json({
			status: 'success',
			groups,
		});
	} catch (err) {
		next(err);
	}
};

// Get All User Groups
exports.getUserGroup = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const group = await Group.findOne({ members: req.user.id, slug });

		res.status(200).json({
			status: 'success',
			group,
		});
	} catch (err) {
		next(err);
	}
};

///////////////////////////////////////////////////////////
// send group join request

exports.sendJoinGroupRequest = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { _id } = req.params;
		const user = req.user.id;

		const updatedGroup = await Group.findOneAndUpdate(
			{ _id },
			{ $addToSet: { requests: user } },
			{ new: true, runValidators: true, session }
		);

		await Notification.create(
			[
				{
					type: 'joinGroupRequestSent',
					sender: user,
					group: updatedGroup._id,
					receiver: updatedGroup.admin,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			group: updatedGroup,
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();

		next(err);
	}
};

// accept group join request

exports.acceptGroupJoinRequest = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { _id } = req.params;
		const { newMember } = req.body;

		const user = req.user.id;

		const updatedGroup = await Group.findOneAndUpdate(
			{ _id, admin: user, requests: newMember },
			{ $addToSet: { members: newMember }, $pull: { requests: newMember } },
			{ new: true, runValidators: true, session }
		);

		if (!updatedGroup) {
			await session.abortTransaction();
			session.endSession();

			return next(
				new AppError('this request cannot be processed. please try later', 400)
			);
		}

		await Notification.create(
			[
				{
					type: 'joinGroupRequestAccepted',
					sender: user,
					group: updatedGroup._id,
					receiver: newMember,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			group: updatedGroup,
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();

		next(err);
	}
};

// reject group request

exports.rejectGroupJoinRequest = async (req, res, next) => {
	try {
		const { _id } = req.params;
		const { newMember } = req.body;

		const user = req.user.id;

		const updatedGroup = await Group.findOneAndUpdate(
			{ _id, admin: user, requests: newMember },
			{ $pull: { requests: newMember } },
			{ new: true, runValidators: true }
		);

		res.status(200).json({
			status: 'success',
			group: updatedGroup,
		});
	} catch (err) {
		next(err);
	}
};

////////////////////////////////////////////////////////
// Find groups user is not in

exports.getAllNotUserGroups = async (req, res, next) => {
	try {
		let { name } = { ...req.query };

		let filter = { members: { $ne: req.user._id } };

		if (name) {
			filter = {
				...filter,
				name: { $regex: name },
			};

			name = { $search: name };
			filter['$text'] = name;
		}

		const groups = await Group.find(filter);

		res.status(200).json({
			status: 'success',
			groups,
		});
	} catch (err) {
		next(err);
	}
};
