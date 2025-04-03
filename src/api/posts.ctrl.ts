import { ParameterizedContext } from 'koa';

interface IPost {
  id: number;
  title: string;
  body: string;
}

export const postsWrite = (ctx: ParameterizedContext) => {};
export const postsRead = (ctx: ParameterizedContext) => {};
export const postsRemove = (ctx: ParameterizedContext) => {};
export const postsReplace = (ctx: ParameterizedContext) => {};
export const postsUpdate = (ctx: ParameterizedContext) => {};
