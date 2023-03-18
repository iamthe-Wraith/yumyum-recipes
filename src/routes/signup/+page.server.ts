import { fail } from '@sveltejs/kit';
import type { ApiError } from '$lib/error';
import { parseFormData } from '$lib/helpers/request';
import { createUser, sterilizeUser, type INewUserData } from '$lib/services/user';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    try {
      const data = await parseFormData<INewUserData>(request);
      const user = await createUser(data);

      // TODO: set auth token as cookie

      // TODO: redirect user to dashboard

      return { success: true, user: sterilizeUser(user) };
    } catch (err: any) {
      return fail(err.status, (err as ApiError).toJSON());
    }
  }
} satisfies Actions;