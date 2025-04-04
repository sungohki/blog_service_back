import Joi from 'joi';

export const newPostSchema = Joi.object().keys({
  title: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

export const updatePostSchema = Joi.object().keys({
  title: Joi.string(),
  body: Joi.string(),
  tags: Joi.array().items(Joi.string()),
});
