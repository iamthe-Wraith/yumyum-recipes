import { redirect, type Actions, fail } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { Logger } from '$lib/services/log';
import { getRecipes } from '$lib/services/recipe';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/error';
import { MealPlanStatus } from '@prisma/client';
import { addMealToPlan, createMealPlan, getMealPlan, type IMealPlanData, type IUpdateMealPlanData } from '$lib/services/meal_plans';
import { parseFormData } from '$lib/helpers/request';

export const actions = {
  addMealToPlan: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    let data: IUpdateMealPlanData;

    try {
      data = await parseFormData<IUpdateMealPlanData>(request);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error adding this meal to your meal plan. Please try again later.', 500);

      Logger.error('Error parsing meal plan form data: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      const mealPlan = await addMealToPlan(data, locals.user);
      return { mealPlan };
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error adding this meal to your meal plan. Please try again later.', 500);

      Logger.error('Error adding meal to plan: ', err);
      
      return fail(error.status, error.toJSON());
    }
  },
  createMealPlan: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    let data: IMealPlanData;

    try {
      data = await parseFormData<IMealPlanData>(request);
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error creating your meal plan. Please try again later.', 500);

      Logger.error('Error parsing meal plan form data: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }

    try {
      let mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, locals.user);

      if (mealPlan) throw new ApiError('You already have an active meal plan. Please complete or delete it before creating a new one.', 400);

      mealPlan = await createMealPlan(data, locals.user);

      return { mealPlan };
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error creating your meal plan. Please try again later.', 500);

      Logger.error('Error creating meal plan: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }
  },
  createGroceryList: async ({ locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    try {
      const mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, locals.user);

      // TODO: create grocery list

      if (!mealPlan) throw new ApiError('There are no active meal plans to create a grocery list from.', 400);

      Logger.log('Creating grocery list for meal plan: ', mealPlan.id, mealPlan.name);

      return {};
    } catch (err) {
      const error = err instanceof ApiError
        ? new ApiError(err.message, err.status)
        : new ApiError('There was an error creating your grocery list. Please try again later.', 500);

      Logger.error('Error creating grocery list: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }
  }
} satisfies Actions;

export const load = wrapServerLoadWithSentry(async ({ locals }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const [recipes] = await Promise.all([
      getRecipes(locals.user),
    ]);
    return { recipes };
  } catch (err) {
    const error = err instanceof ApiError
      ? new ApiError(err.message, err.status, err.field)
      : new ApiError('An error has occurred.', 500);

    Logger.error('Error getting recipes: ', err);
    
    return { error: error.toJSON() };
  }
}) satisfies PageServerLoad;