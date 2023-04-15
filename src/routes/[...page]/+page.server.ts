import { error } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { PageServerLoad } from './$types';

export const load = wrapServerLoadWithSentry(async () => {
  throw error(404, 'Not Found');
}) satisfies PageServerLoad;