import express from 'express';
import * as authController from './../controllers/authController';
import * as userController from './../controllers/userController';

const router = express.Router();

router.get('/logout', authController.logoutUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get('/me', authController.parseAuthCookie, userController.me);

router
	.route('/')
	.get(userController.getAllUsers)
	.delete(userController.deleteUsers);

export default router;
