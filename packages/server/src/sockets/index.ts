// import mongoose from 'mongoose';
// import { Server } from 'socket.io';
// import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GroupModel, UserModel } from '../models';
import { NotifType } from '../models/notification.model';
import { NotificationModel } from '../models';

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

export const handleFriendRequestSent = async (
	io: any,
	socket: any,
	data: any
) => {
	const user = await UserModel.findOneAndUpdate(
		{
			$and: [
				{ _id: data.receiver._id },
				{ requests: { $ne: data.sender._id } },
			],
		},
		{ $push: { requests: data.sender._id } },
		{ new: true }
	);

	if (!user) return;

	const notification = await NotificationModel.create({
		type: NotifType.FRIEND_REQUEST_SENT,
		sender: data.sender._id,
		receiver: data.receiver._id,
	});

	io.emit(`user-${notification.receiver}`, {
		...(notification as any)._doc,
		group: {
			...data.group,
		},
		sender: {
			...data.sender,
		},
		receiver: {
			...data.receiver,
		},
	});
};

export const handleFriendRequestAccepted = async (
	io: any,
	socket: any,
	data: any
) => {
	const user = await UserModel.findOneAndUpdate(
		{
			$and: [
				{ _id: data.receiver._id },
				{ requests: { $eq: data.sender._id } },
			],
		},
		{
			$push: { friends: data.sender._id },
			$pull: { requests: data.sender._id },
		},
		{ new: true }
	);

	if (!user) return;

	await NotificationModel.deleteOne({ _id: data.notificationId });

	const notification = await NotificationModel.create({
		type: NotifType.FRIEND_REQUEST_ACCEPTED,
		sender: data.receiver._id,
		receiver: data.sender._id,
	});

	io.emit(`user-${notification.receiver}`, {
		...(notification as any)._doc,
		group: {
			...data.group,
		},
		sender: {
			...data.sender,
		},
		receiver: {
			...data.receiver,
		},
	});
};
