import { z } from 'zod';
import { IngredientType, IngredientUnitOfMeasure } from '$types/models';

export const recipeSchema = z.object({
  name: z.string({
    required_error: 'Recipe name is required.',
    invalid_type_error: 'Recipe name must be a string.',
  })
    .min(1, { message: 'Recipe name must be at least 1 character.' })
    .max(50, { message: 'Recipe name cannot be more than 50 characters.' }),
  description: z.string({
    invalid_type_error: 'Recipe description must be a string.',
  })
    .min(1, { message: 'Recipe description must be at least 1 character.' })
    .max(300, { message: 'Recipe description cannot be more than 300 characters.' }),
  prepTime: z.string({
    invalid_type_error: 'Prep time must be a string.',
  })
    .regex(/min|hour/gm, { message: 'Prep time must be in minutes and hours.' }),
  cookTime: z.string({
    invalid_type_error: 'Cook time must be a string.',
  })
    .regex(/min|hour/gm, { message: 'Cook time must be in minutes and hours.' }),
  servings: z.preprocess(
    (x) => parseInt(z.string().parse(x), 10),
    z.number({
      invalid_type_error: 'Servings must be a number.',
    }).positive().min(1, { message: 'Servings must be at least 1.' })
  ),
  ingredients: z.object({
    id: z.number({
      invalid_type_error: 'Ingredient IDs must be a number.',
    })
      .optional(),
    amount: z.number({
      required_error: 'Each ingredient must specify an amount.',
      invalid_type_error: 'Ingredient amounts must be a number.',
    })
      .gt(0, { message: 'Ingredient amounts must be greater than 0.' }),
    name: z.string({
      required_error: 'Each ingredient must have a name.',
      invalid_type_error: 'Ingredient names must be a string.',
    })
      .min(1, { message: 'Ingredient names must be at least 1 character.' }),
    type: z.enum(Object.values(IngredientType) as [string, ...string[]], {
      required_error: 'Each ingredient must specify a type.',
      invalid_type_error: 'Invalid ingredient type found.',
    }),
    unit: z.enum(Object.values(IngredientUnitOfMeasure) as [string, ...string[]], {
      invalid_type_error: 'Invalid ingredient unit found.',
    })
      .optional()
      .nullable(),
  })
    .array()
    .min(1, { message: 'Recipes must have at least 1 ingredient.' }),
  steps: z.string()
    .min(1, { message: 'Recipe steps must have at least 1 character.' })
    .array()
    .min(1, { message: 'Recipes must have at least 1 step. ' }),
  notes: z.string({
    invalid_type_error: 'Notes must be a string.',
  })
    .max(500, { message: 'Recipe notes must be less than 500 characters.' })
    .optional(),
  isPublic: z.string({
    invalid_type_error: 'isPublic must be a string.',
  })
    .default('false')
    .transform((val) => val === 'true')
});