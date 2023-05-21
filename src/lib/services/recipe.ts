import { HttpStatus } from '$lib/constants/error';
import { UnitsOfMeasure } from '$lib/constants/ingredients';
import { prisma } from '$lib/db/client';
import { ApiError } from '$lib/error';
import { IngredientType, IngredientUnitOfMeasure, type recipes, type users } from '@prisma/client';
import { Logger } from './log';
import { recipeSchema, type IRecipeData } from '$lib/schemas/recipe';

export interface IGetRecipeOptions {
  sort?: 'asc' | 'desc';
  includePublic?: boolean;
}

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
