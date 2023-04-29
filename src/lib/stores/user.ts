import type { user_settings } from '@prisma/client';
import { writable } from 'svelte/store';

interface IUser {
  id: number;
  email: string;
  settings: user_settings;
  createdAt: string;
  updatedAt: string;
}

function createUserStore() {
  const { subscribe, set, update } = writable<IUser | null>(null);

  return {
    subscribe,
    set: (user: IUser) => set(user),
    updateSettings: (settings: user_settings) => update((user) => {
      (user || {} as IUser).settings = settings;
      return user;
    }),
    reset: () => set(null)
  };
}

export const user = createUserStore();