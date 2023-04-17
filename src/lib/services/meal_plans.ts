import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { prisma } from '$lib/db/client';
import { MealPlanStatus, type users } from '@prisma/client';
import { ApiError } from '$lib/error';
import { HttpStatus } from '$lib/constants/error';

dayjs.extend(utc);

const mealPlanSchema = z.object({
  name: z.string({
    invalid_type_error: 'Recipe name must be a string.',
  })
    .default(dayjs().utc().format('YYYY-MM-DD')),
});

export type IMealPlanData = z.infer<typeof mealPlanSchema> & { id?: number };

export const createMealPlan = async (data: IMealPlanData, requestor: users) => {
  const parsed = validateMealPlanData(data);

  const mealPlan = await prisma.meal_plans.create({
    data: {
      ...parsed.data,
      ownerId: requestor.id,
      status: MealPlanStatus.ACTIVE,
    },
    include: {
      recipes: true,
    },
  });

  return mealPlan;
};

export const getMealPlan = async (query: Record<string, any>, requestor: users) => await prisma.meal_plans.findFirst({
  where: {
    ...query,
    ownerId: requestor.id
  },
  include: {
    recipes: true,
  }
});

export const getMealPlans = async (query: Record<string, any> = {}, requestor: users) => await prisma.meal_plans.findMany({
  where: {
    ...query,
    ownerId: requestor.id
  }
});

export const validateMealPlanData = (data: IMealPlanData) => {
  const parsed = mealPlanSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};