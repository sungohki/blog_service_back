import { ParameterizedContext } from 'koa';
import Post from '@/models/post';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

interface IPost {
  _id: number;
  title: string;
  body: string;
  tags: Array<string>;
}

const NUM_OF_POSTS = 10;

export const postsWrite = async (ctx: ParameterizedContext) => {
  // 전처리
  const newPostSchema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });
  const schemaCheckResult = newPostSchema.validate(ctx.request.body);
  if (schemaCheckResult.error) {
    ctx.status = 400; // Bad Request
    ctx.body = schemaCheckResult.error;
    console.error('error: 잘못된 request body');
    return;
  }

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
  const page = +ctx.query.page / 1;
  if (page < 1) {
    ctx.status = 400; // Bad  Request
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(NUM_OF_POSTS)
      .skip((page - 1) * NUM_OF_POSTS)
      .exec(); // 최신 글을 상단으로 정렬
    const postCount = await Post.countDocuments().exec(); // .countDocuments : 모델 인스턴스 반환

    // http 헤더에 Last-Page 항목 추가
    ctx.set('Last-Page', Math.ceil(postCount / 10) + '');
    // 본문 200자 이내 제한 출력
    ctx.body = posts
      .map((item) => item.toJSON())
      .map((item) => ({
        ...item,
        body:
          item.body.length > 200 ? item.body.slice(0, 197) + '...' : item.body,
      }));
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
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
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const postsRemove = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // No Content
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const postsUpdate = async (ctx: ParameterizedContext) => {
  const newPostSchema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  const schemaCheckResult = newPostSchema.validate(ctx.request.body);
  if (schemaCheckResult.error) {
    ctx.status = 400; // Bad Request
    ctx.body = schemaCheckResult.error;
    console.error('error: 잘못된 request body');
    return;
  }

  const { id } = ctx.params;

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    ctx.body = post;
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};
