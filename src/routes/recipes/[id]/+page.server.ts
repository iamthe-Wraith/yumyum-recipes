import { getRecipe } from "$lib/services/recipe";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ApiError } from "$lib/error";

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