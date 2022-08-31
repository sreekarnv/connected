import * as authController from './../controllers/auth.controller';
import * as commentController from './../controllers/comment.controller';
import express from 'express';

const router = express.Router();

router.use(authController.parseAuthCookie);

router.route('/').post(commentController.createComment);

export default router;
