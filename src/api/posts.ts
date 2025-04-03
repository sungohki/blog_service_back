import Router from 'koa-router';
import * as PC from './posts.ctrl';
import checkObjectId from '@/middlewares/checkObjectid';
import checkLoggedIn from '@/middlewares/checkLoggedIn';

const postApi = new Router();
const postUserApi = new Router();

// postApi.get('/', (ctx, next)=>{});
postApi.get('/', PC.postsList);
postApi.post('/', checkLoggedIn, PC.postsWrite);

postUserApi.get('/', PC.postsRead);
postUserApi.patch('/', checkLoggedIn, PC.postsUpdate);
postUserApi.delete('/', checkLoggedIn, PC.postsRemove);

postApi.use('/:id', checkObjectId, postUserApi.routes());

export default postApi;
