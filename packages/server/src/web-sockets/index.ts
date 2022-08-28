// import mongoose from 'mongoose';
// import { Server } from 'socket.io';
// import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import GroupModel from '../models/group.model';
import NotificationModel, { NotifType } from '../models/notification.model';

export const handleGroupJoinRequestSent = async (
	io: any,
	socket: any,
	data: any
) => {
	const group = await GroupModel.findOneAndUpdate(
		{ $and: [{ _id: data.group._id }, { requests: { $ne: data.user._id } }] },
		{ $push: { requests: data.user._id } },
		{ new: true }
	).select('admin');

	if (!group) {
		return;
	}

	const notification = await NotificationModel.create({
		type: NotifType.JOIN_GROUP_REQUEST_SENT,
		sender: data.user,
		receiver: group.admin,
		group: group._id,
	});

	io.emit(`user-${notification.receiver}`, {
		...(notification as any)._doc,
		sender: {
			...data.user,
		},
		group: {
			...data.group,
		},
	});
};

export const handleGroupJoinRequestAccepted = async (
	io: any,
	socket: any,
	data: any
) => {
	const group = await GroupModel.findOneAndUpdate(
		{ $and: [{ _id: data.group._id }, { requests: { $eq: data.user._id } }] },
		{ $push: { members: data.user._id }, $pull: { requests: data.user._id } },
		{ new: true }
	);

	if (!group) {
		return;
	}

	await NotificationModel.findByIdAndDelete(data.notificationId);

	const notification = await NotificationModel.create({
		type: NotifType.JOIN_GROUP_REQUEST_ACCEPTED,
		sender: group.admin,
		receiver: data.user._id,
		group: group._id,
	});

	io.emit(`user-${notification.receiver}`, {
		...(notification as any)._doc,
		group: {
			...data.group,
		},
	});
};
