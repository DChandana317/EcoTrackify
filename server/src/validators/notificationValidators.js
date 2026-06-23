import Joi from 'joi';

export const notificationPrefsSchema = Joi.object({
  reminders: Joi.boolean(),
  tipsDigest: Joi.boolean(),
  quietHoursStart: Joi.number().min(0).max(23),
  quietHoursEnd: Joi.number().min(0).max(23)
});
