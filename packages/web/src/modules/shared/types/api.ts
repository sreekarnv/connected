export interface PhotoType {
	_id: string;
	url: string;
	publicId: string;
}

export interface CommentType {
	_id: string;
	content: string;
	user: UserType;
	createdAt: Date;
}

export interface UserType {
	_id: string;
	email: string;
	name: string;
	photo?: PhotoType;
	isActive?: boolean;
	roles?: string[];
	createdAt?: Date;
	updatedAt?: Date;
	groups?: GroupType[];
}

export interface PostType {
	_id: string;
	content: string;
	user: UserType;
	likes: string[];
	photo?: PhotoType;
	dislikes: string[];
	comments: CommentType[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ImageSettings {
	x: number;
	y: number;
	width: number;
	height: number;
	scaleX: number;
	scaleY: number;
	rotate: number;
}

export interface GroupType {
	_id: string;
	name: string;
	description: string;
	photo?: PhotoType;
	groupType: 'public' | 'private';
	admin: UserType;
	members: string[];
	requests: string[];
	createdAt: Date;
	updatedAt: Date;
}

export enum NotifType {
	FRIEND_REQUEST_SENT = 'FRIEND_REQUEST_SENT',
	FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',

	JOIN_GROUP_REQUEST_SENT = 'JOIN_GROUP_REQUEST_SENT',
	JOIN_GROUP_REQUEST_ACCEPTED = 'JOIN_GROUP_REQUEST_ACCEPTED',

	NEW_GROUP_POST = 'NEW_GROUP_POST',
}

export type NotificationType = {
	_id: string;
	type: NotifType;
	sender: UserType;
	receiver?: UserType;
	group?: GroupType;
	post?: PostType;
};
