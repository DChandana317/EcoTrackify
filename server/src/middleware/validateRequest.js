export const validateBody = (schema) => async (req, _res, next) => {
  try {
    req.body = await schema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (error) {
    const details = error.details?.map((detail) => detail.message) || [error.message];
    next({ statusCode: 400, message: 'Validation failed', details });
  }
};

export const validateQuery = (schema) => async (req, _res, next) => {
  try {
    req.query = await schema.validateAsync(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (error) {
    const details = error.details?.map((detail) => detail.message) || [error.message];
    next({ statusCode: 400, message: 'Invalid query params', details });
  }
};
