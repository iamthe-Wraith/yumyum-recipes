import { HttpStatus } from "$lib/constants/error";
import { prisma } from "$lib/db/client";
import { ApiError } from "$lib/error";
import { IngredientType, IngredientUnitOfMeasure, type recipes, type users } from "@prisma/client";
import { z } from "zod";
import { log } from "./log";

const recipeSchema = z.object({
  name: z.string({
    required_error: "Recipe name is required.",
    invalid_type_error: "Recipe name must be a string.",
  })
    .max(50, { message: "Recipe name must be less than 50 characters." }),
  description: z.string({
    invalid_type_error: "Password must be a string.",
  }),
  prepTime: z.string({
    invalid_type_error: "Prep time must be a string.",
  })
    .regex(/min|hour/gm, { message: "Prep time must be in minutes and hours." }),
  cookTime: z.string({
    invalid_type_error: "Cook time must be a string.",
  })
    .regex(/min|hour/gm, { message: "Cook time must be in minutes and hours." }),
  servings: z.preprocess(
    (x) => parseInt(z.string().parse(x), 10),
    z.number({
      invalid_type_error: "Servings must be a number.",
    }).positive().min(1, { message: "Servings must be at least 1." })
  ),
  ingredients: z.object({
    // amount: z.preprocess(
    //   (x) => parseFloat(z.string().parse(x)),
    //   z.number({
    //     invalid_type_error: "Ingredient amounts must be a number.",
    //   }).positive().min(0.01, { message: "Ingredient amounts must be at least 0.01." })
    // ),
    amount: z.number({
      required_error: "Each ingredient must specify an amount.",
      invalid_type_error: "Ingredient amounts must be a number.",
    }),
    name: z.string({
      required_error: "Each ingredient must have a name.",
      invalid_type_error: "Ingredient names must be a string.",
    }),
  })
    .array()
    .optional()
    .default([]),
  steps: z.string()
    .array()
    .optional()
    .default([]),
  notes: z.string({
    invalid_type_error: "Notes must be a string.",
  }),
  isPublic: z.string({
    invalid_type_error: "isPublic must be a string.",
  })
    .default("false")
    .transform((val) => val === "true")
});

export type INewRecipeData = z.infer<typeof recipeSchema>;

export interface IIngredient {
  amount: number;
  name: string;
}

export const createRecipe = async (data: INewRecipeData, requestor: users) => {
  try {
    const parsed = validateRecipeData(data);

    return await prisma.$transaction(async (tx) => {
      let recipe = await tx.recipes.create({
        data: {
          ...parsed.data,
          ownerId: requestor.id,
          ingredients: undefined,
        },
      });

      await tx.ingredients.createMany({
        data: parsed.data.ingredients.map(({
          name,
          amount,
        }) => ({
          recipeId: recipe.id,
          name,
          amount,
          unit: IngredientUnitOfMeasure.TABLESPOON,
          kelevens: 5.0,
          type: IngredientType.DRY,
        })),
      });

      const ingredients = await tx.ingredients.findMany({
        where: {
          recipeId: recipe.id,
        },
      })

      recipe = await tx.recipes.update({
        where: {
          id: recipe.id,
        },
        data: {
          ingredients: {
            connect: ingredients.map((ingredient) => ({
              id: ingredient.id,
            })),
          },
        },
      });

      // TODO: figure out if there is more efficient way to do the above

      return recipe;
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      log('Error creating recipe: ', err);

      throw new ApiError('There was an error creating your recipe. Please try again later.', HttpStatus.SERVER, undefined, data);
    }
  }
}

export const parseIngredients = (amounts: string[], names: string[]): IIngredient[] => {
  // TODO: update this error with other ingredient properties
  if (amounts?.length !== names?.length) throw new ApiError('Each ingredient must have an amount and a name.', HttpStatus.INVALID_ARG, 'ingredients', {amounts, names});

  const ingredients: IIngredient[] = [];

  console.log('>>>>> amounts: ', amounts);

  for (let i = 0; i < amounts.length; i++) {
    ingredients.push({
      amount: parseFloat(amounts[i]),
      name: names[i],
    });
  }

  return ingredients;
}

export const validateRecipeData = (data: INewRecipeData) => {
  const parsed = recipeSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path[0].toString(), data);
  }

  return parsed;
}