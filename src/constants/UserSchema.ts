import Joi from 'joi';

export const userSchemaForCreate = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().required(),
});
