import { ApiError } from '$lib/error';
import { createGroceryList, getGroceryListWithItems, updateGroceryList, type IUpdateGroceryListItemData, completeGroceryList } from '$lib/services/grocery_lists';
import { Logger } from '$lib/services/log';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { IGroceryList } from '$types/models';
import { parseFormData } from '$lib/helpers/request';

export const actions = {
  completeGroceryList: async ({ params, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    const planId = parseInt(params.planId);

    try {
      if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);
      const groceryList = await completeGroceryList(planId, locals.user);
      return { groceryList };
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error completing your grocery list. Please try again later.', 500);

      Logger.error('Error completing grocery list: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }
  },
  createGroceryList: async ({ params, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    const planId = parseInt(params.planId);

    try {
      if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);
      await createGroceryList(planId, locals.user);

      return {};
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error creating your grocery list. Please try again later.', 500);

      Logger.error('Error creating grocery list: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }
  },
  updateGroceryListItemStatus: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    try {
      const mealPlanId = parseInt(params.planId, 10);

      if (isNaN(mealPlanId)) throw new ApiError('Invalid meal plan ID', 400);

      const data = await parseFormData<IUpdateGroceryListItemData>(request);

      const groceryList = await updateGroceryList(data, mealPlanId, locals.user);

      return { groceryList };
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error updating your grocery list. Please try again later.', 500);

      Logger.error('Error updating grocery list: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }
  },
} satisfies Actions;

export const load = wrapServerLoadWithSentry(async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const planId = parseInt(params.planId, 10);

    if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);

    const groceryList: IGroceryList | null = await getGroceryListWithItems({}, planId, locals.user);

    if (!groceryList) throw new ApiError('There is no grocery list for this meal plan.', 404);

    return { groceryList };
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('There was an error getting your grocery list. Please try again later.', 500);

    throw error;
  }
}) satisfies PageServerLoad;
