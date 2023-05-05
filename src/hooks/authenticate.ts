import { ApiError } from '$lib/error';
import { isExpired, isValidToken, readToken } from '$lib/services/jwt';
import { Logger } from '$lib/services/log';
import { getSession } from '$lib/services/session';
import type { Handle } from '@sveltejs/kit';

export const authenticate = (async ({ event, resolve }) => {
  const session = event.cookies.get('session');

  if (session) {
    try {
      const sessionPayload = readToken(session);

      if (!isValidToken(sessionPayload) || isExpired(sessionPayload)) {
        event.cookies.delete('session');
        return resolve(event);
      }

      const data = await getSession(session);

      if (data?.user) {
        event.locals = { ...event.locals, user: data.user };
      }
    } catch (err) {
      Logger.error('Authentication error: ', err);

      throw err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error completing your grocery list. Please try again later.', 500);
    }
  }

  return resolve(event);
}) satisfies Handle;
