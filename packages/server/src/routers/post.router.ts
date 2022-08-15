import * as authController from './../controllers/auth.controller';
import * as postController from './../controllers/post.controller';
import express from 'express';

const router = express.Router();

router.use(authController.parseAuthCookie, authController.protectRoutes);

router
	.route('/')
	.get(postController.getAllPosts)
	.post(postController.createPost);

router.patch('/:_id/like', postController.likePost);
router.patch('/:_id/dislike', postController.dislikePost);

export default router;
