import Joi from 'joi';

export const goalCreateSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().max(500).allow('', null),
  targetValue: Joi.number().min(1).max(10_000).required(),
  unit: Joi.string().max(20).default('%'),
  baselineValue: Joi.number().min(0).optional(),
  targetDate: Joi.date().greater('now').required(),
  cadence: Joi.string().valid('daily', 'weekly', 'monthly').default('weekly'),
  remindersEnabled: Joi.boolean().default(true)
});

export const goalUpdateSchema = Joi.object({
  currentValue: Joi.number().min(0),
  status: Joi.string().valid(
    'not_started',
    'in_progress',
    'on_track',
    'off_track',
    'completed'
  ),
  remindersEnabled: Joi.boolean()
}).min(1);
