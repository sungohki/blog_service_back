import Koa from 'koa';
import dotenv from 'dotenv';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import checkJwt from './middlewares/checkJwt';
import path from 'path';
import serve from 'koa-static';
import send from 'koa-send';
dotenv.config();

const app = new Koa();
const router = new Router();
router.use('/api', api.routes());

const { PORT, MONGO_URI } = process.env;
const port = PORT || 4000;

// mondo db connecting
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error(error);
  });

// request body 파싱
app.use(bodyParser());
app.use(checkJwt);
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve('build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
