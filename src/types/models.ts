import type { meal_plans, meals } from '@prisma/client';

export interface IMealPlan extends meal_plans {
  meals: meals[];
}