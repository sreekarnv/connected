import * as authController from './../controllers/auth.controller';
import * as userController from './../controllers/user.controller';
import express from 'express';
import { resizeImage } from '../utils/resizeImage';

const router = express.Router();

router.post('/login', authController.login);
router.post(
	'/signup',
	userController.uploadProfileImage,
	resizeImage('users'),
	authController.signup
);
router.post('/logout', authController.logout);

router.use(authController.parseAuthCookie);
router.get('/me', authController.getLoggedinUser);

export default router;
