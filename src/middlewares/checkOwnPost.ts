import { StatusCodes } from 'http-status-codes';
import { Next, ParameterizedContext } from 'koa';

const checkOwnPost = async (ctx: ParameterizedContext, next: Next) => {
  const { user, post } = ctx.state;
  if (user._id !== post.user._id + '') {
    ctx.status = StatusCodes.FORBIDDEN; // 403
    return;
  }
  return next();
};
export default checkOwnPost;
