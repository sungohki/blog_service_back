import Router from 'koa-router';
import * as PC from './posts.ctrl';

const postApi = new Router();

postApi.get('/', PC.postsList);
postApi.post('/', PC.postsWrite);
postApi.get('/:id', PC.postsRead);
postApi.patch('/:id', PC.postsUpdate);
postApi.delete('/:id', PC.postsRemove);

export default postApi;
