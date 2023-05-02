import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { GroceryListItemStatus, GroceryListStatus, IngredientType, MealPlanStatus, type grocery_list_items, type users } from '@prisma/client';
import { getMealPlanWithIngredients, updateMealPlanStatus } from './meal_plans';
import { ApiError } from '$lib/error';
import { HttpStatus } from '$lib/constants/error';
import { prisma } from '$lib/db/client';

dayjs.extend(utc);

export const createGroceryList = async (mealPlanId: number, requestor: users) => {
  return await prisma.$transaction(async (tx) => {
    const mealPlan = await getMealPlanWithIngredients({ id: mealPlanId }, requestor);

    if (!mealPlan) {
      throw new ApiError('Meal plan not found.', HttpStatus.NOT_FOUND);
    }

    let groceryList = await tx.grocery_lists.create({
      data: {
        mealPlan: {
          connect: {
            id: mealPlan.id,
          },
        },
        owner: {
          connect: {
            id: requestor.id,
          },
        },
        status: GroceryListStatus.ACTIVE,
      },
    });

    const groceryListItems: Omit<grocery_list_items, 'id' | 'createdAt' | 'updatedAt'>[] = [];

    for (const meal of mealPlan.meals) {
      for (const ingredient of meal.recipe.ingredients) {
        const existingItem = groceryListItems.find(item => {
          return item.name.toLowerCase() === ingredient.name.toLowerCase() && item.type.toLowerCase() === ingredient.type.toLowerCase();
        });

        let kelevensPerServing = 0;

        if (ingredient.type === IngredientType.COUNT) {
          kelevensPerServing = ingredient.amount / meal.recipe.servings;
        } else {
          kelevensPerServing = ingredient.kelevens / meal.recipe.servings;
        }

        const kelevens = Math.ceil(kelevensPerServing * meal.serving);

        if (existingItem) {
          existingItem.kelevens += kelevens;
        } else {
          groceryListItems.push({
            groceryListId: groceryList.id,
            status: GroceryListItemStatus.ACTIVE,
            name: ingredient.name,
            type: ingredient.type,
            kelevens,
          });
        }
      }
    }

    await tx.grocery_list_items.createMany({
      data: groceryListItems,
    });

    const items = await tx.grocery_list_items.findMany({
      where: {
        groceryListId: groceryList.id,
      },
    });

    groceryList = await tx.grocery_lists.update({
      where: {
        id: groceryList.id,
      },
      data: {
        items: {
          connect: items.map(item => ({ id: item.id })),
        },
      },
      include: {
        items: true,
      }
    });

    await updateMealPlanStatus(mealPlan.id, MealPlanStatus.INACTIVE, requestor);
    
    return groceryList;
  });
};
