import mongoose, { Schema } from 'mongoose';
import { IUser } from './user';

export interface IPostContent {
  title: string;
  body: string;
  tags: Array<string>;
}

interface IPost extends IPostContent {
  _id: string;
  publishedDate: Date;
  user: IUser;
}

const PostSchema: Schema<IPost> = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now(), // 작성 순간을 기본으로 설정
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
