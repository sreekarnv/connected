export type Photo = {
	url: string;
	name: string;
	publicId?: string;
};

export type Post = {
	comments: Comment[];
	content: string;
	createdAt?: string | Date;
	updatedAt?: string | Date;
	_id: string;
	id?: string;
	isPublic?: string;
	dislikes: [string];
	likes: [string];
	photo?: Photo;
	user: any;
};

export type User = {
	email: string;
	firstName: string;
	friends?: string[];
	fullName: string;
	lastName: string;
	middleName?: string;
	isActive: boolean;
	isVerified: boolean;
	photo?: Photo;
	requestsReceived: string[];
	requestsSent: string[];
	userVerificationToken?: string | null;
	__v: any;
	_id: string;
};

export type Comment = {
	content: string;
	createdAt: string | Date;
	_id: string;
	id?: string;
	post: string;
	updatedAt?: string | Date;
	user: User;
	__v: string;
};

export type Group = {
	__v?: any;
	_id: string;
	admin?: string;
	createdAt?: string;
	updatedAt?: string;
	description?: string;
	members?: string[];
	name: string;
	requests?: string[];
	slug: string;
	photo?: Photo;
};

export type Notification = {
	createdAt?: Date | string;
	sender: User;
	show: boolean;
	type:
		| 'friendRequestSent'
		| 'friendRequestAccepted'
		| 'joinGroupRequestSent'
		| 'joinGroupRequestAccepted'
		| 'newPublicPost'
		| 'newGroupPost';
	updateAt: Date | string;
	wasRead?: boolean;
	__v?: number;
	_id: string;
	group: Group;
	post: string;
};

export type AlertProps = {
	status: 'error' | 'success' | 'info' | 'warning';
	message: string;
};
