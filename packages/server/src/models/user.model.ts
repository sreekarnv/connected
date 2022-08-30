import {
	prop as Property,
	pre,
	modelOptions,
	index,
	Ref,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Group } from './group.model';
import { Photo } from './photo.model';

export enum Roles {
	User = 'user',
	Admin = 'admin',
}

@pre<User>('findOne', async function (next) {
	this.populate('groups', '_id name photo.url -members');

	next();
})
@pre<User>('save', async function (next) {
	if (!this.isModified('password') && !this.isNew) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined as any;

	next();
})
@index(
	{ createdAt: 1 },
	{
		expireAfterSeconds: 60 * 5,
		partialFilterExpression: { isVerified: false },
	}
)
@index({ name: 'text', email: 'text' })
@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
})
export class User {
	readonly _id!: string;

	@Property({
		required: [true, 'user must provide their email address'],
		unique: true,
		trim: true,
		lowercase: true,
		validate: {
			validator: (value: string) => {
				return String(value)
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					);
			},
			message: `please provide a valid email address`,
		},
	})
	public email!: string;

	@Property({ required: [true, 'user must provide their name'], trim: true })
	public name!: string;

	@Property({
		required: [true, 'user must provide a password'],
		minlength: [6, 'password should atleast have a minimum of 6 characters'],
		select: false,
	})
	public password!: string;

	@Property({
		required: [true, 'user must confirm their password'],
		validate: {
			validator: function (value: string) {
				return value === (this as any).password;
			},
			message: 'passwords do not match',
		},
		select: false,
	})
	public passwordConfirm!: string;

	@Property({
		default: true,
	})
	isActive!: true;

	@Property({
		type: Photo,
	})
	photo?: Photo;

	@Property({
		type: String,
		default: [Roles.User],
	})
	roles!: Roles[];

	@Property({
		localField: '_id',
		foreignField: 'members',
		ref: () => Group,
	})
	groups?: Ref<Group>[] = [];

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	requests?: Ref<User>[] = [];

	@Property({
		type: mongoose.SchemaTypes.ObjectId,
		ref: () => User,
	})
	friends?: Ref<User>[] = [];

	readonly createdAt!: Date;

	readonly updatedAt!: Date;

	async verifyPassword(hash: string, input: string) {
		return await bcrypt.compare(input, hash);
	}

	hasRole(role: Roles) {
		return this.roles.includes(role);
	}
}
