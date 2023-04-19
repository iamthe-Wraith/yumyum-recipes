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

const mealToAddToPlanSchema = z.object({
  recipe: z.preprocess(
    (x) => parseInt(z.string().parse(x), 10),
    z.number({
      invalid_type_error: 'Recipe ID must be a number.',
    }).positive().min(1, { message: 'Invalid recipe ID found.' })
  ),
});

export type IMealPlanData = z.infer<typeof mealPlanSchema> & { id?: number };

export interface IUpdateMealPlanData {
  recipe: number;
}

export const addMealToPlan = async (data: IUpdateMealPlanData, requestor: users) => {
  const parsed = validateMealDataToAddToPlan(data);

  let mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, requestor);
  if (!mealPlan) throw new ApiError('There are no active meal plans to add this meal to. Please create a meal plan and try again.', 400);

  if (mealPlan.recipes.some(recipe => recipe.id === parsed.data.recipe)) throw new ApiError('This recipe is already in your meal plan.', 400);
  
  const recipe = await prisma.recipes.findFirst({
    where: {
      id: parsed.data.recipe,
    },
  });

  if (!recipe) throw new ApiError('This recipe does not exist.', 404);

  mealPlan = await prisma.meal_plans.update({
    where: {
      id: mealPlan.id,
    },
    data: {
      recipes: {
        connect: {
          id: recipe.id,
        },
      },
    },
    include: {
      recipes: true,
    },
  });

  return mealPlan;
};

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

export const removeFromMealPlan = async (data: IUpdateMealPlanData, requestor: users) => {
  const parsed = validateMealDataToAddToPlan(data);

  let mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, requestor);
  if (!mealPlan) throw new ApiError('There are no active meal plans to remove this meal from.', 400);

  if (!mealPlan.recipes.some(recipe => recipe.id === parsed.data.recipe)) throw new ApiError('This recipe is not in your meal plan.', 400);

  mealPlan = await prisma.meal_plans.update({
    where: {
      id: mealPlan.id,
    },
    data: {
      recipes: {
        disconnect: {
          id: parsed.data.recipe,
        },
      },
    },
    include: {
      recipes: true,
    },
  });

  return mealPlan;
};

export const validateMealPlanData = (data: IMealPlanData) => {
  const parsed = mealPlanSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};

export const validateMealDataToAddToPlan = (data: IUpdateMealPlanData) => {
  const parsed = mealToAddToPlanSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};