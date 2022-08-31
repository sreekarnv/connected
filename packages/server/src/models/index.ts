import { getModelForClass } from '@typegoose/typegoose';
import { Comment } from './comment.model';
import { Group } from './group.model';
import { Post } from './post.model';
import { User } from './user.model';
import { Notification } from './notification.model';

export const UserModel = getModelForClass(User);
export const GroupModel = getModelForClass(Group);
export const PostModel = getModelForClass(Post);
export const CommentModel = getModelForClass(Comment);
export const NotificationModel = getModelForClass(Notification);
