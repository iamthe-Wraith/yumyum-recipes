import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getMealPlan } from '$lib/services/meal_plans';
import { ApiError } from '$lib/error';

export const load = wrapServerLoadWithSentry(async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const planId = parseInt(params.planId, 10);

    if (isNaN(planId)) throw new ApiError('Invalid meal plan ID', 400);

    const [mealPlan] = await Promise.all([
      getMealPlan({ id: planId }, locals.user)
    ]);
    return { mealPlan };
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('There was an error getting your meal plan. Please try again later.', 500);

    throw error;
  }
}) satisfies PageServerLoad;