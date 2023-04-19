import type { meal_plans, recipes } from '@prisma/client';

export interface IMealPlan extends meal_plans {
  recipes: recipes[];
}