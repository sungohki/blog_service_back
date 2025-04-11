import { ParameterizedContext } from 'koa';
import Post, { IPostContent } from '@/models/post';
import { StatusCodes } from 'http-status-codes';
import { newPostSchema, updatePostSchema } from '@/constants/PostSchema';
import sanitize, { IOptions } from 'sanitize-html';

const NUM_OF_POSTS = 10;

const sanitizeOpt: IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

const removeHtmlAndShorten = (body: string) => {
  const filtered = sanitize(body, { allowedTags: [] });
  return filtered.length <= 200 ? filtered : `${filtered.slice(0, 197)}...`;
};

export const postsWrite = async (ctx: ParameterizedContext) => {
  // 전처리
  const schemaCheckResult = newPostSchema.validate(ctx.request.body);
  if (schemaCheckResult.error) {
    ctx.status = 400; // Bad Request
    ctx.body = schemaCheckResult.error;
    console.error('error: 잘못된 request body');
    return;
  }

  const { title, body, tags } = ctx.request.body as IPostContent;
  const post = new Post({
    title,
    body: sanitize(body, sanitizeOpt),
    tags,
    user: ctx.state.user,
  });

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
  const { tag, username } = ctx.query as { tag?: string; username?: string };
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(NUM_OF_POSTS || 10)
      .skip((page - 1) * NUM_OF_POSTS)
      .exec(); // 최신 글을 상단으로 정렬
    const postCount = await Post.countDocuments(query).exec(); // .countDocuments : 모델 인스턴스 반환

    // http 헤더에 Last-Page 항목 추가
    ctx.set('Last-Page', Math.ceil(postCount / 10) + '');
    // 본문 200자 이내 제한 출력
    ctx.body = posts
      .map((item) => item.toJSON())
      .map((item) => ({
        ...item,
        body: removeHtmlAndShorten(item.body),
      }));
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const postsRead = async (ctx: ParameterizedContext) => {
  ctx.body = ctx.state.post;
};

export const postsRemove = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = StatusCodes.NO_CONTENT; // 204
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const postsUpdate = async (ctx: ParameterizedContext) => {
  const schemaCheckResult = updatePostSchema.validate(ctx.request.body);
  if (schemaCheckResult.error) {
    ctx.status = 400; // Bad Request
    ctx.body = schemaCheckResult.error;
    console.error('error: 잘못된 request body');
    return;
  }

  const { id } = ctx.params;
  const nextData = { ...(ctx.request.body as IPostContent) };
  if (nextData.body) {
    nextData.body = sanitize(nextData.body, sanitizeOpt);
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    ctx.body = post;
  } catch (e) {
    ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};
