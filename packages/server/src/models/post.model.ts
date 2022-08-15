import {
	getModelForClass,
	prop as Property,
	modelOptions,
	Ref,
	index,
	pre,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Comment } from './comment.model';
import { Photo } from './photo.model';
import { User } from './user.model';

@pre<Post>(/^find/, function (next) {
	this.populate('user', '_id name email');
	this.populate('comments', '_id content createdAt');
	next();
})
@modelOptions({
	schemaOptions: {
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	},
})
@index({ createdAt: -1 })
export class Post {
	readonly _id!: string;

	@Property({
		type: String,
		trim: true,
		required: [true, 'post must have content'],
	})
	content!: string;

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
		required: [true, 'post must belong to a user'],
	})
	user!: Ref<User>;

	@Property({
		type: Photo,
	})
	photo?: Photo;

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	likes: Ref<User>[] = [];

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	dislikes: Ref<User>[] = [];

	@Property({
		localField: '_id',
		foreignField: 'post',
		ref: () => Comment,
		options: { sort: { createdAt: -1 } },
	})
	comments?: Ref<Comment>[] = [];

	readonly createdAt!: Date;

	readonly updatedAt!: Date;
}

const PostModel = getModelForClass(Post);

export default PostModel;
