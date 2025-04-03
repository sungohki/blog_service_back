import Router from 'koa-router';
import postApi from './posts';

const api = new Router();

api.use('/posts', postApi.routes());

export default api;
