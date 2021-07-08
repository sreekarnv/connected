const express = require('express');
const authController = require('../controllers/authController');
const userController = require('./../controllers/userController');
const notificationController = require('./../controllers/notificationController');

const groupRoutes = require('./groupRoutes');

const router = express.Router();

router.use('/groups', groupRoutes);

router.get(
	'/find-friends',
	authController.protectRoutes,
	userController.getAllNotUserFriends
);

router.post(
	'/unfriend',
	authController.protectRoutes,
	userController.unFriendUser
);

router.patch(
	'/sendFriendRequest',
	authController.protectRoutes,
	userController.sendFriendRequest
);

router.patch(
	'/acceptFriendRequest',
	authController.protectRoutes,
	notificationController.hideNotification,
	userController.acceptFriendRequest
);

router.patch(
	'/rejectFriendRequest',
	authController.protectRoutes,
	notificationController.hideNotification,
	userController.rejectFriendRequest
);

router.get('/checkAuth', authController.checkIsLoggedIn);

router.post(
	'/register',
	userController.uploadUserPhoto,
	userController.resizeUserImage,
	authController.registerUser
);

router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUsers);

router
	.route('/me')
	.get(authController.protectRoutes, userController.getCurrentUserData)
	.patch(
		authController.protectRoutes,
		userController.resizeUserImage,
		userController.uploadUserPhoto,
		userController.updateCurrentUserData
	);

router
	.route('/me/friends')
	.get(authController.protectRoutes, userController.getUserFriends);

router
	.route('/updateCurrentUserPassword')
	.post(authController.protectRoutes, authController.updateUserPassword);

router
	.route('/updateSettings')
	.patch(
		authController.protectRoutes,
		userController.uploadUserPhoto,
		userController.resizeUserImage,
		userController.filterUserUpdateFilter,
		userController.updateCurrentUserData
	);

module.exports = router;
