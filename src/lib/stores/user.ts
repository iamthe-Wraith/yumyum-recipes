import { writable } from 'svelte/store';

interface IUser {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

function createUserStore() {
  const { subscribe, set } = writable<IUser | null>(null);

  return {
    subscribe,
    set: (user: IUser) => set(user),
    reset: () => set(null)
  };
}

export const user = createUserStore();