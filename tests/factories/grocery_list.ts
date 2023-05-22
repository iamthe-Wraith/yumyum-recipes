import { faker } from '@faker-js/faker';
import { GroceryListStatus } from '@prisma/client';

export interface IMockUpdateGroceryListData {
  listId: number;
  itemId: number;
  status: string;
}

const groceryListStatuses = [GroceryListStatus.ACTIVE, GroceryListStatus.INACTIVE];

export const getUpdateGroceryListData = (): IMockUpdateGroceryListData => {
  return {
    listId: faker.number.int({ min: 1, max: 100000 }),
    itemId: faker.number.int({ min: 1, max: 100000 }),
    status: groceryListStatuses[faker.number.int({ min: 0, max: groceryListStatuses.length - 1 })],
  };
};