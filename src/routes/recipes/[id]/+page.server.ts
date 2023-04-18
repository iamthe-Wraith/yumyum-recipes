import { fail, redirect } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { deleteRecipe, getRecipe } from '$lib/services/recipe';
import type { Actions, PageServerLoad } from './$types';
import { ApiError } from '$lib/error';
import { parseFormData } from '$lib/helpers/request';
import { Logger } from '$lib/services/log';

export const actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    try {
      const data = await parseFormData<{ id: string }>(request);
      const id = parseInt(data.id, 10);

      if (isNaN(id)) throw new ApiError('Invalid recipe ID', 400);

      await deleteRecipe(id, locals.user);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error deleting your recipe. Please try again later.', 500);

      Logger.error('Error parsing recipe form data: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, '/recipes?deleted=true');
  }
} satisfies Actions;

export const load = wrapServerLoadWithSentry(async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const [recipe] = await Promise.all([
      getRecipe(params.id, locals.user),
    ]);
    return { recipe };
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('There was an error getting your recipe. Please try again later.', 500);

    throw error;
  }
}) satisfies PageServerLoad;