import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { users } from '@prisma/client';
import { JWT_SESSION_SECRET } from '$env/static/private';
import { SESSION_TOKEN_DURATION } from '$lib/constants/auth';
import { prisma } from '$lib/db/client';
import { ApiError } from '$lib/error';
import { Logger } from './log';

dayjs.extend(utc);

export const isValidToken = (token: JwtPayload | null): token is JwtPayload => (token as JwtPayload)?.sub !== undefined;

export const isExpired = (token: JwtPayload): boolean => {
  const now = dayjs().utc();
  const exp = dayjs((token.exp || 0) * 1000).utc();
  return now.isAfter(exp);
};

export const readToken = (token: string) => {
  return jwt.verify(token, JWT_SESSION_SECRET) as JwtPayload;
};

export const signSessionJWT = async ({ email, id }: users) => {
  try {
    const session = jwt.sign({ sub: email }, JWT_SESSION_SECRET, {
      expiresIn: `${SESSION_TOKEN_DURATION} days`,
    });
  
    await prisma.sessions.create({
      data: {
        userId: id,
        token: session,
      },
    });

    return session;
  } catch (err) {
    Logger.error('Error creating session token: ', err);

    throw new ApiError('Error creating session token.', 500);
  }
};
