import {
	getModelForClass,
	modelOptions,
	prop as Property,
	Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Group } from './group.model';
import { Post } from './post.model';
import { User } from './user.model';

export enum NotifType {
	FRIEND_REQUEST_SENT = 'FRIEND_REQUEST_SENT',
	FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',

	JOIN_GROUP_REQUEST_SENT = 'JOIN_GROUP_REQUEST_SENT',
	JOIN_GROUP_REQUEST_ACCEPTED = 'JOIN_GROUP_REQUEST_ACCEPTED',

	NEW_GROUP_POST = 'NEW_GROUP_POST',
}

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Notification {
	readonly _id!: string;

	@Property({
		required: [true, 'notification must have a type'],
		enum: NotifType,
	})
	type!: string;

	@Property({
		required: true,
		ref: () => User,
		type: mongoose.SchemaTypes.ObjectId,
	})
	sender!: Ref<User>;

	@Property({
		required: true,
		ref: () => User,
		type: mongoose.SchemaTypes.ObjectId,
	})
	receiver!: Ref<User>;

	@Property({
		ref: () => Group,
		type: mongoose.SchemaTypes.ObjectId,
	})
	group?: Ref<Group>;

	@Property({
		ref: () => Post,
		type: mongoose.SchemaTypes.ObjectId,
	})
	post?: Ref<Post>;

	createdAt!: Date;

	updatedAt!: Date;
}
