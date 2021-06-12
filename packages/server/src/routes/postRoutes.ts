import express from 'express';
import * as authController from './../controllers/authController';
import * as postController from './../controllers/postController';

const router = express.Router();

router.use(authController.parseAuthCookie, authController.protectRoutes);

router
	.route('/')
	.post(postController.createPost)
	.get(postController.getAllPosts);

router.route('/:_id/vote').patch(postController.votePost);

router
	.route('/:_id')
	.patch(postController.updatePost)
	.delete(postController.deletePost);

export default router;
