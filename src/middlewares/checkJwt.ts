import { verify } from 'jsonwebtoken';
import { Next, ParameterizedContext } from 'koa';

const checkJwt = (ctx: ParameterizedContext, next: Next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) {
    // 토큰이 없음
    return next();
  }
  try {
    const decoded = verify(token, process.env.JWT_SALT);
    console.log(decoded);
    return next();
  } catch (e) {
    console.error(e);
    return next();
  }
};

export default checkJwt;
