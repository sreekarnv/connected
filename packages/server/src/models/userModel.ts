import { ObjectId } from 'mongodb';
import {
	getModelForClass,
	index,
	modelOptions,
	pre,
	prop as Property,
} from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { BeAnObject, ReturnModelType } from '@typegoose/typegoose/lib/types';
import validator from 'validator';

@pre<User>('save', async function (next) {
	this.password = await argon2.hash(this.password, { hashLength: 14 });
	this.passwordConfirm = undefined as any;
	next();
})
@index({ name: 1 })
@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class User {
	readonly _id!: ObjectId;

	@Property({
		trim: true,
	})
	public name!: string;

	@Property({
		trim: true,
		lowercase: true,
		required: [true, 'user must provide their email address'],
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'please enter a valid email',
		},
	})
	public email!: string;

	@Property({
		required: [true, 'user must provide a password'],
		select: false,
	})
	public password!: string;

	@Property({
		required: [true, 'users must confirm their password'],
		select: false,
		validate: {
			validator: function () {
				const password = (this as any).password;
				const passwordConfirm = (this as any).passwordConfirm;
				return password === passwordConfirm;
			},
			message: 'Passwords do not match',
		},
	})
	public passwordConfirm!: string;

	@Property()
	public photo?: string;

	@Property({
		default: true,
	})
	public isActive?: boolean;

	async checkPassword(hashedPassword: string, inputPassword: string) {
		return await argon2.verify(hashedPassword, inputPassword);
	}
}

const UserModel: ReturnModelType<typeof User, BeAnObject> =
	getModelForClass(User);

export default UserModel;
