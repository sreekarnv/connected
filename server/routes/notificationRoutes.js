const express = require('express');
const authController = require('./../controllers/authController');
const notificationController = require('./../controllers/notificationController');

const router = express.Router();

router.get(
	'/',
	authController.protectRoutes,
	notificationController.getNotifications
);

router.patch(
	'/markAsRead',
	authController.protectRoutes,
	notificationController.readAllNotifications,
	notificationController.getNotifications
);

router.patch(
	'/hide',
	authController.protectRoutes,
	notificationController.hideNotification,
	notificationController.getNotifications
);

module.exports = router;
