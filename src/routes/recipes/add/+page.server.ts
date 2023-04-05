import { fail, redirect } from '@sveltejs/kit';
import { ApiError } from '$lib/error';
import type { Actions } from './$types';
import { log } from '$lib/services/log';
import { parseFormData } from '$lib/helpers/request';
import { createRecipe, parseIngredients, type INewRecipeData } from '$lib/services/recipe';
import type { recipes } from '@prisma/client';

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');
    
    let recipe: recipes | null = null;
    let data: INewRecipeData;

    try {
      data = await parseFormData<INewRecipeData>(request);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      log('Error parsing recipe form data: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      data.ingredients = parseIngredients(
        (data as any)['ingredients.amount'], 
        (data as any)['ingredients.name'],
        (data as any)['ingredients.type'],
        (data as any)['ingredients.unit']
      );
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status, err.field, data)
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      log('Error parsing ingredients: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      recipe = await createRecipe(data, locals.user);
    } catch (err) {
      const error = err instanceof ApiError
      ? new ApiError(err.message, err.status, err.field, data)
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      log('Error creating recipe: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, `/recipes${recipe?.id ? `?recipe=${recipe.id}` : ''}`);
  }
} satisfies Actions;
