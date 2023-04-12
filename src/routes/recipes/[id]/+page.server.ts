import { getRecipe } from "$lib/services/recipe";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ApiError } from "$lib/error";

// export const actions = {
//   default: async ({ request, locals }) => {
//     if (!locals.user) throw redirect(303, '/signin');
    
//     const recipe: recipes | null = null;
//     let data: IRecipeData;

//     try {
//       data = await parseFormData<IRecipeData>(request);
//     } catch (err: any) {
//       const error = err instanceof ApiError
//         ? err
//         : new ApiError('There was an error updating your recipe. Please try again later.', 500);

//       log('Error parsing recipe form data: ', err);
      
//       return fail(error.status, (error as ApiError).toJSON());
//     }

//     try {
//       data.ingredients = parseIngredients(
//         (data as any)['ingredients.amount'], 
//         (data as any)['ingredients.name'],
//         (data as any)['ingredients.type'],
//         (data as any)['ingredients.unit']
//       );
//     } catch (err) {
//       const error = err instanceof ApiError
//         ? new ApiError(err.message, err.status, err.field, data)
//         : new ApiError('There was an error updating your recipe. Please try again later.', 500);

//       log('Error parsing ingredients: ', err);
      
//       return fail(error.status, (error as ApiError).toJSON());
//     }

//     throw redirect(303, `/recipes`);
//   }
// } satisfies Actions;

export const load = (async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/signin');
  
  try {
    const recipe = await getRecipe(params.id, locals.user);
    return { recipe };
  } catch (err) {
    const error = err instanceof ApiError
      ? err
      : new ApiError('There was an error getting your recipe. Please try again later.', 500);

    throw error;
  }
}) satisfies PageServerLoad;