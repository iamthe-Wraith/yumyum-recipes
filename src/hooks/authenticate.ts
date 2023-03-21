import { prisma } from '$lib/db/client';
import { isExpired, isValidToken, readToken } from '$lib/services/jwt';
import { log } from '$lib/services/log';
import { getSession } from '$lib/services/session';
import type { Handle } from '@sveltejs/kit';

export const authenticate = (async ({ event, resolve }) => {
  const session = event.cookies.get('session');

  if (session) {
    try {
      const sessionPayload = readToken(session);

      if (!isValidToken(sessionPayload) || isExpired(sessionPayload)) {
        // TODO: delete session cookie
        return resolve(event);
      }

      const data = await getSession(session);

      if (data?.user) event.locals = { ...event.locals, user: data.user }
    } catch (err) {
      log('[-] authentication error: ', err);
    }
  }

  return resolve(event);
}) satisfies Handle;
