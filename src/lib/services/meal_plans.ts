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
    })
      .positive()
      .min(1, { message: 'Invalid recipe ID found.' })
  ),
  servings: z.preprocess(
    (x) => parseInt(z.string().parse(x), 10),
    z.number({
      invalid_type_error: 'Serving size must be a number.',
    })
      .positive()
      .min(1, { message: 'Invalid serving size found.' })
  )
});

const mealToRemoveFromPlanSchema = z.object({
  meal: z.preprocess(
    (x) => parseInt(z.string().parse(x), 10),
    z.number({
      invalid_type_error: 'Meal ID must be a number.',
    })
      .positive()
      .min(1, { message: 'Invalid meal ID found.' })
  ),
});

export type IMealPlanData = z.infer<typeof mealPlanSchema> & { id?: number };

export interface IAddMealPlanData {
  recipe: number;
}

export interface IRemoveMealPlanData {
  meal: number;
}

export const addMealToPlan = async (data: IAddMealPlanData, requestor: users) => {
  const parsed = validateMealDataToAddToPlan(data);

  let mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, requestor);
  if (!mealPlan) throw new ApiError('There are no active meal plans to add this meal to. Please create a meal plan and try again.', 400);

  if (mealPlan.meals.some(meal => meal.recipe.id === parsed.data.recipe)) throw new ApiError('This recipe is already in your meal plan.', 400);
  
  return await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipes.findFirst({
      where: {
        id: parsed.data.recipe,
      },
    });

    if (!recipe) throw new ApiError('This recipe does not exist.', 404);

    const settings = await tx.user_settings.findFirst({
      where: {
        userId: requestor.id,
      },
    });

    const meal = await tx.meals.create({
      data: {
        ownerId: requestor.id,
        recipeId: recipe.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mealPlanId: mealPlan!.id,
        serving: parsed?.data?.servings || settings?.defaultServingSize || recipe.servings, // TODO: update this with the user's input. if no input, fallback to user's default. if default not set, then fallback to recipe serving size.
      },
      include: {
        recipe: true,
      },
    });

    mealPlan = await tx.meal_plans.update({
      where: {
        id: mealPlan?.id,
      },
      data: {
        meals: {
          connect: {
            id: meal.id,
          },
        },
      },
      include: {
        meals: {
          include: {
            recipe: true,
          }
        },
      },
    });

    return mealPlan;
  });

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
      meals: {
        include: {
          recipe: true,
        }
      },
    },
  });

  return mealPlan;
};

export const deleteMealPlan = async (mealPlanId: number, requestor: users) => {
  const mealPlan = await getMealPlan({ id: mealPlanId }, requestor);
  if (!mealPlan) throw new ApiError('This meal plan does not exist.', 404);

  return await prisma.$transaction(async (tx) => {
    await tx.meals.deleteMany({ where: { mealPlanId } });
    await tx.meal_plans.delete({ where: { id: mealPlanId } });
  });
};

export const getMealPlanWithIngredients = async (query: Record<string, any>, requestor: users) => {
  return await prisma.meal_plans.findFirst({
    where: {
      ...query,
      ownerId: requestor.id
    },
    include: {
      meals: {
        include: {
          recipe: {
            include: {
              ingredients: true,
            }
          },
        }
      },
    },
  });
};

export const getMealPlan = async (query: Record<string, any>, requestor: users) => {
  return await prisma.meal_plans.findFirst({
    where: {
      ...query,
      ownerId: requestor.id
    },
    include: {
      meals: {
        include: {
          recipe: true,
        }
      },
    },
  });
};

export const getMealPlans = async (query: Record<string, any> = {}, requestor: users) => await prisma.meal_plans.findMany({
  where: {
    ...query,
    ownerId: requestor.id
  },
  include: {
    _count: {
      select: {
        meals: true,
      }
    }
  }
});

export const removeFromMealPlan = async (data: IRemoveMealPlanData, requestor: users) => {
  const parsed = validateMealDataToRemoveFromPlan(data);

  let mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, requestor);
  if (!mealPlan) throw new ApiError('There are no active meal plans to remove this meal from.', 400);

  if (!mealPlan.meals.some(meal => meal.id === parsed.data.meal)) throw new ApiError('This recipe is not in your meal plan.', 400);

  return await prisma.$transaction(async (tx) => {
    await tx.meals.delete({
      where: {
        id: parsed.data.meal,
      },
    });

    mealPlan = await getMealPlan({ status: MealPlanStatus.ACTIVE }, requestor);
  
    return mealPlan;
  });
};

export const updateMealPlanStatus = async (mealPlanId: number, status: MealPlanStatus, requestor: users) => {
  const mealPlan = await getMealPlan({ id: mealPlanId }, requestor);
  if (!mealPlan) throw new ApiError('This meal plan does not exist.', 404);

  return await prisma.meal_plans.update({
    where: {
      id: mealPlanId,
    },
    data: {
      status,
    },
  });
};

export const validateMealPlanData = (data: IMealPlanData) => {
  const parsed = mealPlanSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};

export const validateMealDataToAddToPlan = (data: IAddMealPlanData) => {
  const parsed = mealToAddToPlanSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};

export const validateMealDataToRemoveFromPlan = (data: IRemoveMealPlanData) => {
  const parsed = mealToRemoveFromPlanSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};