import { StatusCodes } from 'http-status-codes';

export const notFoundHandler = (_req, res, _next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'error',
    message: 'Resource not found'
  });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';
  const details = err.details || undefined;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(status).json({
    status: 'error',
    message,
    details
  });
};
