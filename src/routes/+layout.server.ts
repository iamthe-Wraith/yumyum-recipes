import { getMealPlan } from '$lib/services/meal_plans';
import { MealPlanStatus } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { ApiError } from '$lib/error';
import { Logger } from '$lib/services/log';

export const load = (async ({ locals }) => {
  if (!locals.user) return {};

  const data: Record<string, any> = {
    user: {
      id: locals.user.id,
      email: locals.user.email,
      createdAt: locals.user.createdAt.toISOString(),
      updatedAt: locals.user.updatedAt.toISOString()
    }
  };

  try {
    const mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, locals.user);

    if (mealPlan) data.mealPlan = mealPlan;
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('Error retrieving page data.', 500);

    Logger.error('Error retrieving page data: ', error.toJSON());
  }

  return data;
}) satisfies LayoutServerLoad;