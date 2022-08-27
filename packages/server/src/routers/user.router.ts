import * as authController from './../controllers/auth.controller';
import * as userController from './../controllers/user.controller';
import express from 'express';
// import { resizeImage } from '../utils/resizeImage';

const router = express.Router();

router.use(authController.parseAuthCookie, authController.protectRoutes);

router.get('/update-password', userController.updatePassword);

export default router;
