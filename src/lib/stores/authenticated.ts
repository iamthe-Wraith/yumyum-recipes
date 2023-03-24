import { derived } from 'svelte/store';
import { user } from './user';

function createAuthenticatedStore() {
	const { subscribe } = derived(user, ($user, set) => {
    set(!!$user)
  });

	return {
		subscribe,
	};
}

export const authenticated = createAuthenticatedStore();