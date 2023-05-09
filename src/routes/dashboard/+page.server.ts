import { redirect } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { PageServerLoad } from './$types';
import { getRecipesCount } from '$lib/services/recipe';
import { getActiveGroceryLists } from '$lib/services/grocery_lists';
import { Logger } from '$lib/services/log';
import type { IGroceryList } from '$types/models';

interface IDashboardData {
  recipes?: number;
  groceryLists?: IGroceryList[];
}

export const load = wrapServerLoadWithSentry(async ({ locals }) => {
  if (!locals.user) throw redirect(303, '/signin');

  const data: IDashboardData = {};

  try {
    data.recipes = await getRecipesCount(locals.user);
  } catch (err) {
    Logger.error('Error getting recipes for dashboard: ', err);
  }

  try {
    const groceryLists = await getActiveGroceryLists(locals.user);
    data.groceryLists = groceryLists;
  } catch (err) {
    Logger.error('Error getting grocery lists for dashboard: ', err);
  }

  return data;
}) satisfies PageServerLoad;