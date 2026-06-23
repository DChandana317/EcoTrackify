import Joi from 'joi';

const bannedWords = ['spam', 'fake news', 'offensive'];

export const tipCreateSchema = Joi.object({
  title: Joi.string().min(5).max(120).required(),
  body: Joi.string().min(30).max(1000).required(),
  tags: Joi.array().items(Joi.string().max(30)).max(5).default([])
}).custom((value, helpers) => {
  const lowerBody = value.body.toLowerCase();
  const hasBanned = bannedWords.some((word) => lowerBody.includes(word));
  if (hasBanned) {
    return helpers.error('any.invalid', { message: 'Content contains flagged words' });
  }
  return value;
});

export const tipQuerySchema = Joi.object({
  search: Joi.string().allow('', null),
  tag: Joi.string().allow('', null)
});
