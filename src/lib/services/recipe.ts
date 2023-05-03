import { HttpStatus } from '$lib/constants/error';
import { UnitsOfMeasure } from '$lib/constants/ingredients';
import { prisma } from '$lib/db/client';
import { ApiError } from '$lib/error';
import { IngredientType, IngredientUnitOfMeasure, type recipes, type users } from '@prisma/client';
import { z } from 'zod';
import { Logger } from './log';

export interface IGetRecipeOptions {
  sort?: 'asc' | 'desc';
  includePublic?: boolean;
}

const recipeSchema = z.object({
  name: z.string({
    required_error: 'Recipe name is required.',
    invalid_type_error: 'Recipe name must be a string.',
  })
    .min(1, { message: 'Recipe name must be at least 1 character.' })
    .max(50, { message: 'Recipe name must be less than 50 characters.' }),
  description: z.string({
    invalid_type_error: 'Password must be a string.',
  })
    .min(1, { message: 'Recipe name must be at least 1 character.' })
    .max(300, { message: 'Recipe name must be less than 50 characters.' }),
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
      .optional(),
  })
    .array()
    .min(1, { message: 'Recipes must have at least 1 ingredient.' }),
  steps: z.string()
    .min(1, { message: 'Recipes must have at least 1 step.' })
    .array()
    .min(1, { message: 'Recipes must have at least 1 step.' }),
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

export type IRecipeData = z.infer<typeof recipeSchema> & { id?: number, image: File | string};

export interface IIngredient {
  amount: number;
  name: string;
  type: IngredientType;
  unit?: IngredientUnitOfMeasure;
}

export const createRecipe = async (data: IRecipeData, requestor: users) => {
  try {
    const parsed = validateRecipeData(data);

    return await prisma.$transaction(async (tx) => {
      let recipe = await tx.recipes.create({
        data: {
          ...parsed.data,
          image: data.image as string,
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
      });

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
      Logger.error('Error creating recipe: ', err);

      throw new ApiError('There was an error creating your recipe. Please try again later.', HttpStatus.SERVER, undefined, data);
    }
  }
};

export const deleteRecipe = async (id: number, requestor: users) => {
  return await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipes.findFirst({
      where: { id },
    });

    if (!recipe) throw new ApiError('Recipe not found.', HttpStatus.NOT_FOUND);
    if (recipe.ownerId !== requestor.id) throw new ApiError('You do not have permission to delete this recipe.', HttpStatus.UNAUTHORIZED);

    await tx.ingredients.deleteMany({
      where: { recipeId: id },
    });

    await tx.recipes.delete({
      where: { id },
    });
  });
};

export const getRecipe = async (id: string | number, requestor: users) => {
  const recipeId = parseInt(id.toString(), 10);

  if (isNaN(recipeId)) throw new ApiError('Invalid recipe ID.', HttpStatus.INVALID_ARG);

  const where: Record<string, string | number | boolean>[] = [
    {
      ownerId: requestor.id,
      id: recipeId,
    },
    {
      isPublic: true,
      id: recipeId,
    }
  ];

  const recipe = await prisma.recipes.findFirst({
    where: {
      OR: where,
    },
    include: {
      ingredients: true,
    },
  });

  if (recipe) {
    return recipe;
  } else {
    throw new ApiError('Recipe not found.', HttpStatus.NOT_FOUND);
  }
};

export const getRecipes = async (requestor: users, options?: IGetRecipeOptions) => {
  const where: Record<string, string | number | boolean> = {
    ownerId: requestor.id,
  };

  if (typeof options?.includePublic === 'boolean') where.isPublic = options.includePublic;

  return prisma.recipes.findMany({
    where,
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      prepTime: true,
      cookTime: true,
      servings: true,
      isPublic: true,
    },
    orderBy: {
      name: options?.sort || 'asc',
    }
  });
};

export const getRecipesCount = async (requestor: users) => prisma.recipes.count({
  where: {
    ownerId: requestor.id,
  }
});

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
};

export const updateRecipe = async (data: IRecipeData & { image: string }, requestor: users) => {
  try {
    const parsed = validateRecipeData(data);

    let recipeId: number;

    if (data.id) {
      recipeId = parseInt(data.id?.toString(), 10);
      if (isNaN(recipeId)) throw new ApiError('Invalid recipe ID.', HttpStatus.INVALID_ARG);
    } else {
      throw new ApiError('Invalid recipe ID.', HttpStatus.INVALID_ARG);
    }

    const dataToUpdate: Partial<recipes> = {
      name: parsed.data.name,
      description: parsed.data.description,
      prepTime: parsed.data.prepTime,
      cookTime: parsed.data.cookTime,
      servings: parsed.data.servings,
      isPublic: parsed.data.isPublic,
      steps: parsed.data.steps,
      notes: parsed.data.notes,
    };

    if (typeof data.image === 'string') dataToUpdate.image = data.image as string;

    return await prisma.$transaction(async (tx) => {
      let recipe = await tx.recipes.findFirst({ where: { id: recipeId } });

      if (!recipe || recipe === null) throw new ApiError('Recipe not found.', HttpStatus.NOT_FOUND);
      if (recipe.ownerId !== requestor.id) throw new ApiError('You do not have permission to update this recipe.', HttpStatus.UNAUTHORIZED);

      recipe = await tx.recipes.update({
        where: { id: recipeId },
        data: dataToUpdate,
      });

      await tx.ingredients.deleteMany({
        where: {
          recipeId: recipe.id,
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
            recipeId,
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
      });

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
      Logger.error('Error updating recipe: ', err);

      throw new ApiError('There was an error updating your recipe. Please try again later.', HttpStatus.SERVER, undefined, data);
    }
  }
};

export const validateRecipeData = (data: IRecipeData) => {
  const parsed = recipeSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path.join('.'), data);
  }

  return parsed;
};
