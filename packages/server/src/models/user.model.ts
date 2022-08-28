import {
	getModelForClass,
	prop as Property,
	pre,
	modelOptions,
	index,
} from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { Photo } from './photo.model';

export enum Roles {
	User = 'user',
	Admin = 'admin',
}

@pre<User>('save', async function (next) {
	if (!this.isModified('password') && !this.isNew) return next();

	this.password = await argon2.hash(this.password, { hashLength: 15 });
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

	readonly createdAt!: Date;

	readonly updatedAt!: Date;

	async verifyPassword(hash: string, input: string) {
		return await argon2.verify(hash, input);
	}

	hasRole(role: Roles) {
		return this.roles.includes(role);
	}
}

const UserModel = getModelForClass(User);

export default UserModel;
