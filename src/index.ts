import Koa from 'koa';
import dotenv from 'dotenv';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
dotenv.config();

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 4000;
app.use(bodyParser());

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
