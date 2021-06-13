export type Post = {
	_id: string;
	content: string;
	createdAt?: Date;
	userLiked: boolean;
	userDisliked: boolean;
	user: User;
	photo?: string;
	numofLikes: number;
	numofDislikes: number;
};

export type User = {
	_id: string;
	createdAt?: Date;
	updatedAt?: Date;
	email?: string;
	name: string;
	isActive?: string;
};
