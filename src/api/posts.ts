import Router from 'koa-router';
import * as PC from './posts.ctrl';

const postApi = new Router();

postApi.get('/', (ctx) => {});
postApi.post('/', PC.postsWrite);
postApi.get('/:id');
postApi.post('/:id');
postApi.patch('/:id');
postApi.delete('/:id');

export default postApi;
