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
	isActive?: boolean;
	roles?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PostType {
	_id: string;
	content: string;
	user: UserType;
	likes: string[];
	dislikes: string[];
	comments: CommentType[];
	createdAt: Date;
	updatedAt: Date;
}
