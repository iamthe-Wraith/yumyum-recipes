import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { prisma } from '$lib/db/client';
import { isValidToken, readToken } from '$lib/services/jwt';
import type { PageServerLoad } from './$types';

export const load = wrapServerLoadWithSentry(async ({ locals, cookies }) => {
  delete locals.user;
  const sessionToken = cookies.get('session');
  
  if (sessionToken) {
    const sessionPayload = readToken(sessionToken);

    cookies.delete('session');

    if (sessionPayload && isValidToken(sessionPayload)) {
      prisma.sessions.delete({
        where: {
          token: sessionToken,
        }
      });
    }
  }
}) satisfies PageServerLoad;