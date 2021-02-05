const express = require('express');
const authController = require('./../controllers/authController');
const groupController = require('./../controllers/groupController');
const notificationController = require('./../controllers/notificationController');

const postRoutes = require('./postRoutes');

const router = express.Router({ mergeParams: true });

// send join group request

router.use('/:group/posts', postRoutes);

router.get(
	'/new',
	authController.protectRoutes,
	groupController.getAllNotUserGroups
);

router.get(
	'/:_id/sendGroupJoinRequest',
	authController.protectRoutes,
	groupController.sendJoinGroupRequest
);

// accept join group request
router.patch(
	'/:_id/acceptGroupJoinRequest',
	authController.protectRoutes,
	notificationController.hideNotification,
	groupController.acceptGroupJoinRequest
);

router.patch(
	'/:_id/rejectGroupJoinRequest',
	authController.protectRoutes,
	notificationController.hideNotification,
	groupController.rejectGroupJoinRequest
);

// Get all groups
router
	.route('/all')
	.get(authController.protectRoutes, groupController.getAllGroups);

router
	.route('/all/:slug')
	.get(authController.protectRoutes, groupController.getGroup);

// Get logged in user groups
router
	.route('/')
	.get(authController.protectRoutes, groupController.getAllUserGroups)
	.post(
		authController.protectRoutes,
		groupController.uploadGroupPhoto,
		groupController.resizeGroupPhoto,
		groupController.createGroup
	);

// Get logged in use group
router
	.route('/:slug')
	.get(authController.protectRoutes, groupController.getUserGroup);

router
	.route('/:_id')
	.patch(
		authController.protectRoutes,
		groupController.uploadGroupPhoto,
		groupController.resizeGroupPhoto,
		groupController.updateGroup
	)
	.delete(authController.protectRoutes, groupController.deleteGroup);

module.exports = router;
