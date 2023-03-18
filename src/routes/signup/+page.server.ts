import { fail } from '@sveltejs/kit';
import type { ApiError } from '$lib/error';
import { parseFormData } from '$lib/helpers/request';
import { createUser, validateNewUserData, type INewUserData } from '$lib/services/user';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    try {
      const parsed = await parseFormData<INewUserData>(request);
      await validateNewUserData(parsed);
  
      const user = await createUser(parsed.email, parsed.password);

      // TODO: set auth token as cookie

      // TODO: redirect user to dashboard

      return { success: true, user };
    } catch (err: any) {
      return fail(err.status, (err as ApiError).toJSON());
    }
  }
} satisfies Actions;