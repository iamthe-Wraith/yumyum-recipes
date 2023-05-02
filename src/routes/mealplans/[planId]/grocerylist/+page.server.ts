import { ApiError } from '$lib/error';
import { createGroceryList } from '$lib/services/grocery-lists';
import { Logger } from '$lib/services/log';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  createGroceryList: async ({ params, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    const planId = parseInt(params.planId);

    try {
      if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);
      await createGroceryList(planId, locals.user);
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error creating your grocery list. Please try again later.', 500);

      Logger.error('Error creating grocery list: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    throw redirect(303, `/mealplans/${planId}/grocerylist`);
  },
} satisfies Actions;
