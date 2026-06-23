import Joi from 'joi';

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(80),
  profile: Joi.object({
    location: Joi.string().max(120).allow('', null),
    bio: Joi.string().max(200).allow('', null),
    householdSize: Joi.number().integer().min(1).max(12)
  })
    .optional()
    .unknown(false)
}).min(1);
