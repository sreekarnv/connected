const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { default: validator } = require('validator');

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, 'user must provide their first name'],
			validate: [validator.isAlpha, 'only alphabets are allowed'],
		},
		middleName: {
			type: String,
			trim: true,
			lowercase: true,
			validate: [validator.isAlpha, 'only alphabets are allowed'],
		},
		lastName: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, 'user must provide their last name'],
			validate: [validator.isAlpha, 'only alphabets are allowed'],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: [true, 'user with this email already exists'],
			required: [true, 'user must provide their email id'],
			validate: [validator.isEmail, 'please provide a valid email id'],
		},
		password: {
			type: String,
			minlength: 6,
			required: [true, 'users must have a password'],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'users must confirm their password'],
			validate: [
				function (el) {
					return this.password === el;
				},
				'passwords do not match',
			],
		},
		photo: {
			type: String,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		passwordChangedAt: {
			type: Date,
		},
		friends: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
		requestsReceived: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
		requestsSent: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
		timestamps: true,
	}
);

userSchema.index({
	email: 'text',
	lastName: 'text',
	firstName: 'text',
	middleName: 'text',
});

userSchema.virtual('fullName').get(function () {
	return `${
		this.firstName
	} ${this.middleName ? this.middleName : ''} ${this.lastName}`;
});

userSchema.pre(/^find/, function (next) {
	this.find({ isActive: true });
	next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('photo') || !this.photo) return next();

	this.photo = `/uploads/users/${this.photo}`;

	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1500;
	next();
});

userSchema.methods.checkPassword = async function (
	enteredPassword,
	dbPassword
) {
	return await bcrypt.compare(enteredPassword, dbPassword);
};

userSchema.methods.checkJwtExpires = function (issuedAt, expiresAt) {
	return expiresAt * 1000 > Date.now() && issuedAt * 1000 < Date.now();
};

userSchema.methods.checkPasswordChangedAt = function (
	issuedAt,
	expiresAt,
	passwordChangedAt
) {
	const passwordChangedAtTime = new Date(passwordChangedAt).getTime();
	return (
		issuedAt * 1000 < passwordChangedAtTime &&
		expiresAt * 1000 > passwordChangedAtTime
	);
};

userSchema.methods.hideSensitiveData = function (user) {
	user.password = undefined;
	user.passwordConfirm = undefined;
	user.passwordChangedAt = undefined;
	user.__v = undefined;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
