import {
	getModelForClass,
	prop as Property,
	modelOptions,
	Ref,
	index,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Photo } from './photo.model';
import { User } from './user.model';

enum GROUP_TYPE {
	PUBLIC = 'public',
	PRIVATE = 'private',
}

@index({ name: 'text' })
@modelOptions({
	schemaOptions: {
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	},
})
export class Group {
	readonly _id!: string;

	@Property({
		type: String,
		trim: true,
		required: [true, 'group must have name'],
	})
	name!: string;

	@Property({
		type: String,
		trim: true,
	})
	description?: string;

	@Property({
		type: Photo,
	})
	photo?: Photo;

	@Property({
		default: GROUP_TYPE.PUBLIC,
	})
	groupType: string = GROUP_TYPE.PUBLIC;

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	admin!: Ref<User>;

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	members: Ref<User>[] = [];

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	requests: Ref<User>[] = [];

	readonly createdAt!: Date;

	readonly updatedAt!: Date;
}

const GroupModel = getModelForClass(Group);

export default GroupModel;
