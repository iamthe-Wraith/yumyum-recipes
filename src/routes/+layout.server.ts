import type { LayoutServerLoad } from './$types';
 
export const load = (async ({ locals }) => {
  if (!locals.user) return {};

  return {
    user: {
      id: locals.user.id,
      email: locals.user.email,
      createdAt: locals.user.createdAt,
      updatedAt: locals.user.updatedAt
    }
  };
}) satisfies LayoutServerLoad;