import {
	getModelForClass,
	index,
	modelOptions,
	pre,
	prop as Property,
	Ref,
} from '@typegoose/typegoose';
import { ObjectId } from 'bson';
import { User } from './userModel';

@pre('find', function (next) {
	this.populate('user', ['name']).sort('-createdAt');
	next();
})
@pre('aggregate', function (next) {
	this.sort('-createdAt');

	next();
})
@index({ user: 1 })
@index({ createdAt: -1 })
@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Post {
	@Property({
		required: [true, 'post must contain content'],
	})
	public content!: string;

	@Property({ ref: 'User' })
	public user!: Ref<User>;

	@Property({ ref: 'User' })
	public likes?: Ref<User>[];

	@Property({ ref: 'User' })
	public dislikes?: Ref<User>[];

	@Property()
	public photo?: string;

	public userVoted?: 'like' | 'dislike' | null;

	checkUserVoted(
		user: ObjectId,
		likes: Ref<User, ObjectId | undefined>[] | undefined,
		dislikes: Ref<User, ObjectId | undefined>[] | undefined
	) {
		if (likes && likes.includes(user)) {
			return 'like';
		} else if (dislikes && dislikes.includes(user)) {
			return 'dislike';
		} else {
			return null;
		}
	}
}

const PostModel = getModelForClass(Post);

export default PostModel;
