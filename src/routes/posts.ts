import Router from 'koa-router';

const postApi = new Router();

postApi.get('/');
postApi.post('/');
postApi.get('/:id');
postApi.post('/:id');
postApi.patch('/:id');
postApi.delete('/:id');

export default postApi;
