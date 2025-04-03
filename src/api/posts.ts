import Router from 'koa-router';
import * as PC from './posts.ctrl';
import checkPostId from '@/middlewares/checkPostId';
import checkLoggedIn from '@/middlewares/checkLoggedIn';
import checkOwnPost from '@/middlewares/checkOwnPost';

const postApi = new Router();
const postUserApi = new Router();

// postApi.get('/', (ctx, next)=>{});
postApi.get('/', PC.postsList);
postApi.post('/', checkLoggedIn, PC.postsWrite);

postApi.get('/:id', checkPostId, PC.postsRead);
postApi.patch('/:id', checkPostId, checkLoggedIn, checkOwnPost, PC.postsUpdate);
postApi.delete(
  '/:id',
  checkPostId,
  checkLoggedIn,
  checkOwnPost,
  PC.postsRemove
);

export default postApi;
