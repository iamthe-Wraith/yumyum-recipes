import { prisma } from "$lib/db/client";

export const getSession = async (session: string) => {
  // TODO: move retrieving user data to Redis for faster response
  // only if not found in Redis, then query DB

  const data = await prisma.sessions.findFirst({
    where: {
      token: session,
    },
    include: {
      user: true,
    },
  });

  return data;
}