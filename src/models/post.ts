import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now(), // 작성 순간을 기본으로 설정
  },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
