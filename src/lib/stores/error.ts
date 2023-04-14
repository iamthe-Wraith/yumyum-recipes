import { writable } from 'svelte/store';

interface IAppError {
  message: string;
  title?: string;
}

const { subscribe, set } = writable<IAppError | null>(null);

export const AppError = {
  subscribe,
  set: (error: IAppError) => set(error),
  clear: () => set(null),
};