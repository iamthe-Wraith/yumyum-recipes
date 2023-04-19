import type { IMealPlan } from '$types/models';
import { writable } from 'svelte/store';

function createMealPlanStore() {
  const { subscribe, set } = writable<IMealPlan | null>(null);

  return {
    subscribe,
    set: (mealPlan: IMealPlan) => set(mealPlan),
    reset: () => set(null)
  };
}

export const mealPlan = createMealPlanStore();