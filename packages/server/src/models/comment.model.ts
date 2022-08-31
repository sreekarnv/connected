import {
	getModelForClass,
	prop as Property,
	modelOptions,
	Ref,
	pre,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Post } from './post.model';
import { User } from './user.model';

@pre<User>(/^find/, function (next) {
	this.populate('user', '_id name email');
	next();
})
@modelOptions({
	schemaOptions: {
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	},
})
export class Comment {
	readonly _id!: string;

	@Property({
		type: String,
		trim: true,
		required: [true, 'comment must have content'],
	})
	content!: string;

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
		required: [true, 'comment must belong to a user'],
	})
	user!: Ref<User>;

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
		required: [true, 'comment must belong to a post'],
	})
	post!: Ref<Post>;
}
