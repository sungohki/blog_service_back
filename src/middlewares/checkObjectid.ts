import { Next, ParameterizedContext } from 'koa';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const checkObjectId = (ctx: ParameterizedContext, next: Next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    // mongodb의 _id 양식에 유효하지 않은 경우
    ctx.status = 400;
    console.error('error: 틀린 _id 형식');
    return;
  }
  return next();
};
export default checkObjectId;
