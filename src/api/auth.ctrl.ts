import { userSchemaForCreate } from '@/constants/UserSchema';
import User from '@/models/user';
import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';

interface IBodyUser {
  username: string;
  password: string;
}

export const authRegister = async (ctx: ParameterizedContext) => {
  // 요청 내용과 스키마 비교
  const schemaCheckResult = userSchemaForCreate.validate(ctx.request.body);
  if (schemaCheckResult.error) {
    ctx.status = StatusCodes.BAD_REQUEST; // 400
    ctx.body = schemaCheckResult.error;
    console.error('error: 유효하지 않은 사용자 정보');
    return;
  }

  const { username, password } = ctx.request.body as IBodyUser;

  try {
    // 동일한 사용자 명 확인
    const isExistUsername = await User.findByUsername(username);
    if (isExistUsername) {
      ctx.status = StatusCodes.CONFLICT; // 409
      console.error('error: 중복 사용자 정보');
      return;
    }

    const newUser = new User({ username });
    await newUser.setPassword(password);
    await newUser.save(); // DB에 저장

    ctx.body = newUser.serialize();

    // 토큰 발급 및 쿠키 추가
    const token = newUser.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      httpOnly: true,
    });
  } catch (e) {
    console.error(e);
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const authLogin = async (ctx: ParameterizedContext) => {
  const { username, password } = ctx.request.body as IBodyUser;

  if (!username || !password) {
    // 누락된 정보가 있는 경우 전처리
    ctx.status = StatusCodes.UNAUTHORIZED; // 401
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      // 존재하지 않는 사용자
      console.error('error: 사용자가 존재하지 않습니다.');
      ctx.status = StatusCodes.UNAUTHORIZED;
      return;
    }
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      // 틀린 비밀번호
      console.error('error: 비밀번호가 일치하지 않습니다.');
      ctx.status = StatusCodes.UNAUTHORIZED;
      return;
    }

    ctx.body = user.serialize();

    // 토큰 발급 및 쿠키 추가
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      httpOnly: true,
    });
  } catch (e) {
    console.error(e);
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const authCheck = async (ctx: ParameterizedContext) => {
  const { user } = ctx.state;
  if (!user) {
    // 상태 데이터에 유저 데이터가 없는 경우 전처리
    ctx.status = StatusCodes.UNAUTHORIZED; // 401;
    return;
  }
  ctx.body = user;
};

export const authLogout = async (ctx: ParameterizedContext) => {
  ctx.cookies.set('access_token');
  ctx.status = StatusCodes.NO_CONTENT; // 204
};
