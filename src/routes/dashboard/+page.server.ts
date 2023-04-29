import { redirect } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { PageServerLoad } from './$types';
import { getRecipesCount } from '$lib/services/recipe';
import { Logger } from '$lib/services/log';

interface IDashboardData {
  recipes?: number;
}

export const load = wrapServerLoadWithSentry(async ({ locals }) => {
  if (!locals.user) throw redirect(303, '/signin');

  const data: IDashboardData = {};

  try {
    data.recipes = await getRecipesCount(locals.user);
  } catch (err) {
    Logger.error('Error getting dashboard data: ', err);
  }

  return data;
}) satisfies PageServerLoad;