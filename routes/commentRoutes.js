const express = require('express');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(authController.protectRoutes, commentController.getAllComments)
	.post(authController.protectRoutes, commentController.createComment);

module.exports = router;
