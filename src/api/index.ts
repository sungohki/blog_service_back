import Router from 'koa-router';
import postApi from './posts';
import authApi from './auth';

const api = new Router();

api.use('/posts', postApi.routes());
api.use('/auth', authApi.routes());

export default api;
