/**
 * Last-resort handler.
 *
 * Routes pass real failures here with next(error) rather than each one
 * inventing its own 500 response. The message is logged but never returned:
 * a database error string can name tables and columns, and the client has no
 * use for it either way.
 */
export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error);

  console.error(`${request.method} ${request.originalUrl} failed:`, error.message);
  response.status(500).json({ error: 'Something went wrong on our end' });
};
