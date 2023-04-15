import { fail, redirect } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { ApiError } from '$lib/error';
import { parseFormData } from '$lib/helpers/request';
import { createUser, type INewUserData } from '$lib/services/user';
import type { Actions, PageServerLoad } from './$types';
import { signSessionJWT } from '$lib/services/jwt';
import { SESSION_TOKEN_DURATION } from '$lib/constants/auth';
import { Logger } from '$lib/services/log';

export const actions = {
  default: async ({ request, cookies, locals }) => {
    if (locals.user) throw redirect(303, '/dashboard');    

    try {
      const data = await parseFormData<INewUserData>(request);
      const newUser = await createUser(data);

      const sessionToken = await signSessionJWT(newUser);

      cookies.set('session', sessionToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: (60 * 60 * 24) * SESSION_TOKEN_DURATION });
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('Error creating user.', 500);

      Logger.error('Error creating user: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, '/dashboard');
  }
} satisfies Actions;

export const load = wrapServerLoadWithSentry(async ({ locals }) => {
  if (locals.user) throw redirect(303, '/dashboard');

  return {};
}) satisfies PageServerLoad;
