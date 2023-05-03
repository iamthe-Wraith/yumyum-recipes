import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { deleteMealPlan, getMealPlan } from '$lib/services/meal_plans';
import { ApiError } from '$lib/error';
import { Logger } from '$lib/services/log';
import { getGroceryList } from '$lib/services/grocery_lists';

export const actions = {
  deleteMealPlan: async ({ params, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    try {
      const planId = parseInt(params.planId, 10);

      if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);

      await deleteMealPlan(planId, locals.user);
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error deleting your meal plan. Please try again later.', 500);

      Logger.error('Error deleting meal plan: ', err);
      
      return fail(error.status, error.toJSON());
    }

    throw redirect(303, '/mealplans');
  },
} satisfies Actions;

export const load = wrapServerLoadWithSentry(async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const planId = parseInt(params.planId, 10);

    if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);

    const [mealPlan, groceryList] = await Promise.all([
      getMealPlan({ id: planId }, locals.user),
      getGroceryList({}, planId, locals.user),
    ]);
    return { mealPlan, ...groceryList };
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('There was an error getting your meal plan. Please try again later.', 500);

    throw error;
  }
}) satisfies PageServerLoad;