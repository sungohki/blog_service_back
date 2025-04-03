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

export const postsList = async (ctx: ParameterizedContext) => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const postsRead = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      // 존재하지 않는 게시물
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const postsRemove = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // No Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const postsUpdate = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
