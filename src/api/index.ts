import Router from 'koa-router';
import postApi from './posts';

const api = new Router();

api.get('/', postApi.routes());

export default api;
