const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');

const commentRoutes = require('./commentRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:post/comments', commentRoutes);

router
	.route('/')
	.get(authController.protectRoutes, postController.getAllPosts)
	.post(
		authController.protectRoutes,
		postController.uploadPostPhoto,
		postController.resizePostImage,
		postController.createPost
	);

router
	.route('/:_id/like')
	.patch(authController.protectRoutes, postController.likePost);

router
	.route('/:_id/dislike')
	.patch(authController.protectRoutes, postController.dislikePost);

module.exports = router;
