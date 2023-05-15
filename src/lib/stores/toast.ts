import { writable } from 'svelte/store';

interface IRedirect {
  url: string;
  text: string;
  target?: '_blank';
}

interface IToast {
  message: string;
  redirect?: IRedirect;
  type?: 'success' | 'error';
  duration?: number;
}

const { subscribe, update } = writable<IToast[]>([]);

const duration = 3500;

let timer: number | undefined = undefined;

const remove = () => {
  update(toasts => {
    window.clearTimeout(timer);

    timer = toasts.length > 1
      ? window.setTimeout(remove, duration)
      : undefined;

    const updated = [...toasts];
    updated.pop();

    return updated;
  });
};

const add = (t: IToast) => {
  if (timer === undefined) {
    timer = window.setTimeout(remove, t.duration || duration);
  }

  update(toasts => [t, ...toasts]);
};

export const Toast = {
  subscribe,
  add,
  remove,
};