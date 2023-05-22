import { GroceryListStatus } from '$types/models';
import { z } from 'zod';

export const updateGroceryListItemSchema = z.object({
  listId: z.preprocess(
    (x) => {
      if (typeof x === 'number') {
        return x;
      } else {
        const parsed = z.string().safeParse(x);
        if (parsed.success) {
          return parseInt(parsed.data, 10);
        } else {
          return x;
        }
      }
    },
    z.number({
      required_error: 'Grocery list ID is required.',
      invalid_type_error: 'Grocery list ID must be a number.',
    })
      .positive()
  ),
  itemId: z.preprocess(
    (x) => {
      if (typeof x === 'number') {
        return x;
      } else {
        const parsed = z.string().safeParse(x);
        if (parsed.success) {
          return parseInt(parsed.data, 10);
        } else {
          return x;
        }
      }
    },
    z.number({
      required_error: 'Grocery list item ID is required.',
      invalid_type_error: 'Grocery list item ID must be a number.',
    })
      .positive()
  ),
  status: z.enum(Object.values(GroceryListStatus) as [string, ...string[]], {
    required_error: 'Grocery list item status is required.',
    invalid_type_error: 'Invalid ingredient status found.',
  }),
});

export type IUpdateGroceryListItemData = z.infer<typeof updateGroceryListItemSchema>;