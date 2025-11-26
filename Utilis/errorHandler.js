export const errorHandler = (statusCode = 500, message = 'Internal Server Error') => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.name = 'CustomError';
  return err;
};
