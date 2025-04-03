import Router from 'koa-router';
import * as AC from './auth.ctrl';

const authApi = new Router();

// 요청 유형에 따른 미들웨어 연결
authApi.post('/register', AC.authRegister);
authApi.post('/login', AC.authLogin);
authApi.get('/check', AC.authCheck);
authApi.post('/logout', AC.authLogout);

export default authApi;
