import { prisma } from "$lib/db/client";
import { isValidToken, readToken } from "$lib/services/jwt";
import { user } from "$lib/stores/user";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, cookies }) => {
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
      })
    }
  }
}) satisfies PageServerLoad;