export const HttpStatus: Record<string, number> = {
  AUTHENTICATION: 401,
  AUTHORIZATION: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  FORBIDDEN: 403, // user is known, but lacks the necessary permissions
  INVALID_ARG: 422,
  NOT_ALLOWED: 405,
  NOT_FOUND: 404,
  SERVER: 500,
  SERVICE: 422,
  UNAUTHORIZED: 401, // invalid credentials have been provided
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
};
