import { StatusCodes } from 'http-status-codes';
import { Next, ParameterizedContext } from 'koa';

const checkLoggedIn = (ctx: ParameterizedContext, next: Next) => {
  if (!ctx.state.user) {
    console.log('error: 해당 권한 없음');
    ctx.status = StatusCodes.UNAUTHORIZED; // 401
    return;
  }
  return next();
};

export default checkLoggedIn;
