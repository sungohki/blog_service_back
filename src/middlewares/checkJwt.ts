import User, { IUser } from '@/models/user';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Next, ParameterizedContext } from 'koa';

interface IDecodedUser extends IUser, JwtPayload {
  iat: number;
  exp: number;
}

const checkJwt = async (ctx: ParameterizedContext, next: Next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) {
    // 토큰이 없음
    return next();
  }
  try {
    const decoded = verify(token, process.env.JWT_SALT) as IDecodedUser;
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3) {
      const user = await User.findById(decoded._id);
      const refreshToken = user.generateToken();
      ctx.cookies.set('access_token', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    console.error(e);
    return next();
  }
};

export default checkJwt;
