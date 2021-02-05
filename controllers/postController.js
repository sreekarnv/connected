const mongoose = require('mongoose');

const Post = require('./../models/postModel');
const User = require('./../models/userModel');
const Notification = require('./../models/notificationModel');
const Group = require('../models/groupModel');

const sharp = require('sharp');
const imageUpload = require('../utils/imageUpload');
const { v4: uuidv4 } = require('uuid');

const cloudinary = require('cloudinary').v2;
const AppError = require('../utils/AppError');

// upload images to posts
exports.uploadPostPhoto = imageUpload.single('photo');

exports.resizePostImage = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const { height, width, x: left, y: top } = JSON.parse(req.body.imageSettings);

	req.file.filename = `post-${uuidv4()}.${Date.now()}.jpeg`;

	try {
		await sharp(req.file.buffer)
			.extract({
				left: parseInt(left),
				top: parseInt(top),
				width: parseInt(width),
				height: parseInt(height),
			})
			.resize(2000, 2000)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toFile(`uploads/posts/${req.file.filename}`);

		const uploadedImg = await cloudinary.uploader.upload(
			`uploads/posts/${req.file.filename}`,
			{ use_filename: true, folder: 'connected/posts' }
		);

		req.photo = {
			publicId: uploadedImg.public_id,
			url: uploadedImg.secure_url,
			name: uploadedImg.original_filename,
			signature: uploadedImg.signature,
		};
	} catch (err) {
		return next(
			new AppError('error uploading your image. Please try later', 400)
		);
	}

	next();
};

// Get All Public Posts
exports.getAllPosts = async (req, res, next) => {
	try {
		const { group } = req.params;
		const posts = await Post.find({ group }).sort('-createdAt');

		res.status(200).json({
			status: 'success',
			posts,
		});
	} catch (err) {
		next(err);
	}
};

exports.createPost = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (req.file && req.photo) req.body.photo = req.photo;
		const { content, group, photo } = req.body;
		const user = await User.findById(req.user.id, {}, { session });

		let post = await Post.create(
			[
				{
					content,
					user,
					group,
					photo,
				},
			],
			{ session }
		);

		let type;
		let receiver;
		if (group) {
			const groupDetail = await Group.findById(
				group,
				{},
				{
					session,
				}
			);

			type = 'newGroupPost';

			if (!groupDetail) {
				await session.abortTransaction();
				session.endSession();
				return next(new AppError('Invalid request', 404));
			}

			receiver = [...groupDetail.members];
			receiver = receiver.filter((el) => el != req.user.id);

			post = {
				...post[0]._doc,
				group: {
					...groupDetail._doc,
				},
			};
		}

		if (type && (!post.isPublic || !post[0].isPublic)) {
			await Notification.create(
				[
					{
						type,
						sender: user._id,
						receiver,
						group,
						post: post._id,
					},
				],
				{ session }
			);
		}

		await session.commitTransaction();
		session.endSession();

		res.status(201).json({
			status: 'success',
			post,
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		next(err);
	}
};

exports.likePost = async (req, res, next) => {
	try {
		const user = req.user.id;
		const { _id } = req.params;

		let updatedPost = await Post.findOneAndUpdate(
			{
				_id,
				likes: { $ne: user },
			},
			{ $push: { likes: user }, $pull: { dislikes: user } },
			{ new: true, runValidators: true }
		);

		if (!updatedPost) {
			updatedPost = await Post.findOneAndUpdate(
				{
					_id,
					likes: user,
				},
				{ $pull: { likes: user } },
				{ new: true, runValidators: true }
			);
		}

		res.status(200).json({
			status: 'success',
			updatedPost,
		});
	} catch (err) {
		next(err);
	}
};

exports.dislikePost = async (req, res, next) => {
	try {
		const user = req.user.id;
		const { _id } = req.params;

		let updatedPost = await Post.findOneAndUpdate(
			{
				_id,
				dislikes: { $ne: user },
			},
			{ $push: { dislikes: user }, $pull: { likes: user } },
			{ new: true, runValidators: true }
		);

		if (!updatedPost) {
			updatedPost = await Post.findOneAndUpdate(
				{
					_id,
					dislikes: user,
				},
				{ $pull: { dislikes: user } },
				{ new: true, runValidators: true }
			);
		}

		res.status(200).json({
			status: 'success',
			updatedPost,
		});
	} catch (err) {
		next(err);
	}
};
