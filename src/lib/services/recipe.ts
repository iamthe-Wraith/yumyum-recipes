import { HttpStatus } from "$lib/constants/error";
import { prisma } from "$lib/db/client";
import { ApiError } from "$lib/error";
import type { recipes, users } from "@prisma/client";
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

export const createRecipe = async (data: INewRecipeData, requestor: users) => {
  try {
    const parsed = validateRecipeData(data);

    const recipe = await prisma.recipes.create({
      data: {
        ...parsed.data,
        ownerId: requestor.id,
      }
    });

    return recipe;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      log('Error creating recipe: ', err);

      throw new ApiError('There was an error creating your recipe. Please try again later.', HttpStatus.SERVER, undefined, data);
    }
  }
}

export const validateRecipeData = (data: INewRecipeData) => {
  const parsed = recipeSchema.safeParse(data);

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path[0].toString(), data);
  }

  return parsed;
}