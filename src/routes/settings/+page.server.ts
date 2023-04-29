import { ApiError } from '$lib/error';
import { parseFormData } from '$lib/helpers/request';
import { Logger } from '$lib/services/log';
import { updateUserSettings, type IUpdateUserSettingsData } from '$lib/services/user';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const actions = {
  updateUserSettings: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/signin');

    let data: IUpdateUserSettingsData;

    try {
      data = await parseFormData<IUpdateUserSettingsData>(request);

      const settings = await updateUserSettings(data, locals.user);
      return { settings };
    } catch (err: any) {
      const error = err instanceof ApiError
        ? err
        : new ApiError('There was an error adding this meal to your meal plan. Please try again later.', 500);

      Logger.error('Error parsing meal plan form data: ', err);
      
      return fail(error.status, (error as ApiError).toJSON());
    }
  },
} satisfies Actions;