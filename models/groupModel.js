const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const groupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, 'group must have a name'],
			unique: [true, 'group with this name already exists'],
		},
		description: {
			type: String,
			trim: true,
			lowercase: true,
		},
		photo: {
			name: String,
			publicId: String,
			url: String,
		},
		admin: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'post must belong to a user'],
		},
		members: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
				required: [true, 'post must belong to a user'],
			},
		],
		requests: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
		slug: {
			type: String,
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
		timestamps: true,
	}
);

groupSchema.index({ name: 'text' });
groupSchema.index({ slug: 1 });

groupSchema.pre('save', function (next) {
	if (!this.group) this.isPublic = true;

	if (!this.photo) return next();
	this.photo = `uploads/groups/${this.photo}`;

	next();
});

groupSchema.pre('save', function (next) {
	if (!this.isModified('name')) return next();

	this.slug = slugify(this.name, {
		lower: true,
	});

	next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
