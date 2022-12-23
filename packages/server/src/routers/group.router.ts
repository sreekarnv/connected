import express from 'express';
import { resizeImage } from '../utils/resizeImage';
import * as authController from './../controllers/auth.controller';
import * as groupController from './../controllers/group.controller';

const router = express.Router();

router.use(authController.parseAuthCookie, authController.protectRoutes);

router
	.route('/')
	.get(groupController.getAllGroups)
	.post(
		groupController.uploadGroupImage,
		resizeImage('groups'),
		groupController.createGroup
	);

router
	.route('/reject-join-request/:_id')
	.patch(groupController.rejectGroupJoinRequest);

router.route('/:_id').get(groupController.getGroup);

router
	.route('/join-public-group')
	.patch(groupController.addPublicGroupToMyGroups);

export default router;
