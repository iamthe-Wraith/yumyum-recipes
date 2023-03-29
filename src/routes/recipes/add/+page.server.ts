import { fail, redirect } from '@sveltejs/kit';
import { ApiError } from '$lib/error';
import type { Actions, PageServerLoad } from './$types';
import { log } from '$lib/services/log';
import { parseFormData } from '$lib/helpers/request';
import { createRecipe, type INewRecipeData } from '$lib/services/recipe';
import type { recipes } from '@prisma/client';

export const actions = {
  default: async ({ request, locals }) => {
    let recipe: recipes | null = null;
    try {
      if (!locals.user) throw redirect(303, '/signin');

      const data = await parseFormData<INewRecipeData>(request);
      recipe = await createRecipe(data, locals.user);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      log('Error adding new recipe: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, `/recipes${recipe?.id ? `?recipe=${recipe.id}` : ''}`);
  }
} satisfies Actions;

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;