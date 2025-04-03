import Post from '@/models/post';
import { StatusCodes } from 'http-status-codes';
import { Next, ParameterizedContext } from 'koa';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const checkPostId = async (ctx: ParameterizedContext, next: Next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    // mongodb의 _id 양식에 유효하지 않은 경우
    ctx.status = StatusCodes.BAD_REQUEST; // 400
    console.error('error: 틀린 _id 형식');
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = StatusCodes.NOT_FOUND; // 404
      return;
    }
    ctx.state.post = post;
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e); // 500
  }
  return next();
};
export default checkPostId;
