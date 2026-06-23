import Joi from 'joi';

const categoryEnum = ['transportation', 'energy', 'waste', 'food', 'other'];
const unitEnum = ['km', 'miles', 'kwh', 'kg', 'lbs', 'liters', 'gallons', 'items'];

export const emissionCreateSchema = Joi.object({
  category: Joi.string()
    .valid(...categoryEnum)
    .required(),
  subCategory: Joi.string().allow('', null),
  quantity: Joi.number().min(0).max(1_000_000).required(),
  unit: Joi.string()
    .valid(...unitEnum)
    .required(),
  emissionFactor: Joi.number().min(0).max(10_000).required(),
  entryDate: Joi.date()
    .max('now')
    .min(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365))
    .required(),
  notes: Joi.string().max(500).allow('', null)
});

export const emissionQuerySchema = Joi.object({
  category: Joi.string().valid(...categoryEnum),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate')),
  limit: Joi.number().min(1).max(100).default(20)
});

export const emissionUpdateSchema = emissionCreateSchema.fork(
  ['category', 'subCategory', 'quantity', 'unit', 'emissionFactor', 'entryDate', 'notes'],
  (schema) => schema.optional()
);
