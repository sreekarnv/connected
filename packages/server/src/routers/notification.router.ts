import express from 'express';
import * as authController from './../controllers/auth.controller';
import * as notificationController from './../controllers/notification.controller';

const router = express.Router();

router.use(authController.parseAuthCookie, authController.protectRoutes);

router.get('/', notificationController.getNotifications);

router.delete('/:_id', notificationController.deleteNotification);

export default router;
