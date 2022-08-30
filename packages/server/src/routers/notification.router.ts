import express from 'express';
import * as authController from './../controllers/auth.controller';
import * as notificationController from './../controllers/notification.controller';

const router = express.Router();

router.use(authController.parseAuthCookie);

router.get(
	'/',
	authController.protectRoutesWithoutError,
	notificationController.getNotifications
);

router.delete(
	'/:_id',
	authController.protectRoutes,
	notificationController.deleteNotification
);

export default router;
