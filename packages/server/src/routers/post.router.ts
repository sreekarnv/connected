import * as authController from './../controllers/auth.controller';
import * as postController from './../controllers/post.controller';
import express from 'express';

const router = express.Router();

router.use(authController.parseAuthCookie);

router
	.route('/')
	.get(postController.getAllPosts)
	.post(postController.createPost);

export default router;
