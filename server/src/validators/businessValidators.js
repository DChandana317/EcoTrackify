import Joi from 'joi';

export const businessCreateSchema = Joi.object({
  name: Joi.string().min(3).max(120).required(),
  domain: Joi.string().domain().required()
});
