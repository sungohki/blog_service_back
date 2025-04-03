import Router from 'koa-router';
import * as PC from './posts.ctrl';
import { checkObjectId } from '@/middlewares/checkObjectid';

const postApi = new Router();
const postUserApi = new Router();

// postApi.get('/', (ctx, next)=>{});
postApi.get('/', PC.postsList);
postApi.post('/', PC.postsWrite);

postApi.get('/:id', checkObjectId, PC.postsRead);
postApi.patch('/:id', checkObjectId, PC.postsUpdate);
postApi.delete('/:id', checkObjectId, PC.postsRemove);

export default postApi;
