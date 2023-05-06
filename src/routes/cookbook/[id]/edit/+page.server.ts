import { fail, redirect } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { ApiError } from '$lib/error';
import type { Actions, PageServerLoad } from './$types';
import { parseFormData } from '$lib/helpers/request';
import { parseIngredients, type IRecipeData, getRecipe, updateRecipe } from '$lib/services/recipe';
import { uploadImage } from '$lib/services/upload';
import { Logger } from '$lib/services/log';

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');
    
    let data: IRecipeData;

    try {
      data = await parseFormData<IRecipeData>(request);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error updating your recipe. Please try again later.', 500);

      Logger.error('Error parsing recipe form data: ', err);
      
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
        : new ApiError('There was an error updating your recipe. Please try again later.', 500);

      Logger.error('Error parsing ingredients: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      if (!!(data.image as File).name && (data.image as File).name !== 'undefined') {
        data.image = await uploadImage(data.image as File, locals.user.id, data.name);
      }
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status, err.field, data)
        : new ApiError('There was an error updating your recipe. Please try again later.', 500);

      Logger.error('Error uploading recipe image: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      await updateRecipe({
        ...data,
        image: data.image as string,      
      }, locals.user);
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status, err.field, data)
        : new ApiError('There was an error updating your recipe. Please try again later.', 500);

      Logger.error('Error updating recipe: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, `/cookbook/${data.id}`);
  }
} satisfies Actions;

export const load = wrapServerLoadWithSentry(async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const recipe = await getRecipe(params.id, locals.user);
    return { recipe };
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('There was an error retrieving your recipe. Please try again later.', 500);

    Logger.error('Error getting recipe: ', err);

    throw error;
  }
}) satisfies PageServerLoad;