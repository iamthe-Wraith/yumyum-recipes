import { prisma } from "$lib/db/client";

export const getSession = async (session: string) => {
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