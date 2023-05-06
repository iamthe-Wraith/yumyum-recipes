import { fail, redirect } from '@sveltejs/kit';
import type { recipes } from '@prisma/client';
import { ApiError } from '$lib/error';
import type { Actions } from './$types';
import { parseFormData } from '$lib/helpers/request';
import { createRecipe, parseIngredients, type IRecipeData } from '$lib/services/recipe';
import { uploadImage } from '$lib/services/upload';
import { Logger } from '$lib/services/log';

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');
    
    let recipe: recipes | null = null;
    let data: IRecipeData;

    try {
      data = await parseFormData<IRecipeData>(request);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

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
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      Logger.error('Error parsing ingredients: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      let url = 'https://s3.us-east-2.wasabisys.com/yumyum/default_recipe_image.png';

      if (!!(data.image as File).name && (data.image as File).name !== 'undefined') {
        url = await uploadImage(data.image as File, locals.user.id, data.name);
      }
      
      data.image = url;
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status, err.field, data)
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      Logger.error('Error uploading recipe image: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      recipe = await createRecipe(data, locals.user);
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status, err.field, data)
        : new ApiError('There was an error creating your recipe. Please try again later.', 500);

      Logger.error('Error creating recipe: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, `/cookbook${recipe?.id ? `?recipe=${recipe.id}` : ''}`);
  }
} satisfies Actions;
