import { ParameterizedContext } from 'koa';
import Post from '@/models/post';

interface IPost {
  _id: number;
  title: string;
  body: string;
  tags: Array<string>;
}

export const postsWrite = async (ctx: ParameterizedContext) => {
  const { title, body, tags } = ctx.request.body as IPost;
  const post = new Post({ title, body, tags });

  try {
    await post.save();
    ctx.body = post;
  } catch (error) {
    ctx.body = error;
  }
};
export const postsRead = (ctx: ParameterizedContext) => {};
export const postsRemove = (ctx: ParameterizedContext) => {};
export const postsReplace = (ctx: ParameterizedContext) => {};
export const postsUpdate = (ctx: ParameterizedContext) => {};
