import { HttpStatus } from "$lib/constants/error";
import { UnitsOfMeasure } from "$lib/constants/ingredients";
import { prisma } from "$lib/db/client";
import { ApiError } from "$lib/error";
import { IngredientType, IngredientUnitOfMeasure, type users } from "@prisma/client";
import { z } from "zod";
import { log } from "./log";

const recipeSchema = z.object({
  name: z.string({
    required_error: "Recipe name is required.",
    invalid_type_error: "Recipe name must be a string.",
  })
    .min(1, { message: "Recipe name must be at least 1 character." })
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
    amount: z.number({
      required_error: "Each ingredient must specify an amount.",
      invalid_type_error: "Ingredient amounts must be a number.",
    })
      .gt(0, { message: "Ingredient amounts must be greater than 0." }),
    name: z.string({
      required_error: "Each ingredient must have a name.",
      invalid_type_error: "Ingredient names must be a string.",
    })
      .min(1, { message: "Ingredient names must be at least 1 character." }),
    type: z.enum(Object.values(IngredientType) as [string, ...string[]], {
      required_error: "Each ingredient must specify a type.",
      invalid_type_error: "Invalid ingredient type found.",
    }),
    unit: z.enum(Object.values(IngredientUnitOfMeasure) as [string, ...string[]], {
      invalid_type_error: "Invalid ingredient unit found.",
    })
      .optional(),
  })
    .array()
    .min(1, { message: "Recipes must have at least 1 ingredient." }),
  steps: z.string()
    .min(1, { message: "Recipes must have at least 1 step." })
    .array()
    .min(1, { message: "Recipes must have at least 1 step." }),
  notes: z.string({
    invalid_type_error: "Notes must be a string.",
  })
    .max(500, { message: "Recipe notes must be less than 500 characters." })
    .optional(),
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
  type: IngredientType;
  unit?: IngredientUnitOfMeasure;
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
          type,
          unit,
        }) => {
          const unitOfMeasure = type === IngredientType.COUNT
            ? UnitsOfMeasure.find((uom) => uom.type === IngredientType.COUNT)
            : UnitsOfMeasure.find((uom) => uom.name === unit && uom.type === type);

          if (!unitOfMeasure) throw new ApiError(`Invalid unit of measure for ingredient type ${type}.`, HttpStatus.INVALID_ARG, 'type', parsed.data);

          const kelevens = unitOfMeasure.kelevens * amount;

          return {
            recipeId: recipe.id,
            name,
            amount,
            unit: unit as IngredientUnitOfMeasure,
            kelevens,
            type: type as IngredientType,
          };
        }),
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
        include: {
          ingredients: true,
        },
      });

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

export const parseIngredients = (
  amounts: string[], 
  names: string[], 
  types: IngredientType[],
  unitsOfMeasure: IngredientUnitOfMeasure[]
): IIngredient[] => {
  const data = {amounts, names, types, unitsOfMeasure};

  const max = Math.max((amounts?.length || 0), (names?.length || 0), (types?.length || 0));

  if (max === 0) throw new ApiError('A recipe must have at least 1 ingredient.', HttpStatus.INVALID_ARG, 'ingredients', data);
  if (!amounts?.length || amounts.length < max) throw new ApiError('Each ingredient must have an amount.', HttpStatus.INVALID_ARG, 'ingredients', data);
  if (!names?.length || names.length < max) throw new ApiError('Each ingredient must have a name.', HttpStatus.INVALID_ARG, 'ingredients', data);
  if (!types?.length || types.length < max) throw new ApiError('Each ingredient must have a type.', HttpStatus.INVALID_ARG, 'ingredients', data);

  const ingredients: IIngredient[] = [];

  for (let i = 0; i < amounts.length; i++) {
    const unit = (i < unitsOfMeasure.length && unitsOfMeasure[i])
      ? unitsOfMeasure[i]
      : undefined;

    ingredients.push({
      amount: parseFloat(amounts[i]),
      name: names[i],
      type: types[i],
      unit,
    });
  }

  return ingredients;
}

export const validateRecipeData = (data: INewRecipeData) => {
  const parsed = recipeSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
}