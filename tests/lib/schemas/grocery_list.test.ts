import { describe, expect, it, beforeEach } from 'vitest';
import { getUpdateGroceryListData, type IMockUpdateGroceryListData } from '../../factories/grocery_list';
import { updateGroceryListItemSchema } from '$lib/schemas/grocery_list';

let updateGroceryListData: Partial<IMockUpdateGroceryListData>;

describe('schemas/grocery_list', () => {
  beforeEach(() => {
    updateGroceryListData = getUpdateGroceryListData();
  });

  describe('updateGroceryListItemSchema', () => {
    it('should parse grocery list data when data is valid', () => {
      const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.itemId).toEqual(updateGroceryListData.itemId);
        expect(parsed.data.listId).toEqual(updateGroceryListData.listId);
        expect(parsed.data.status).toEqual(updateGroceryListData.status);
      }
    });

    describe('itemId', () => {
      it('should return an error when the itemId is missing', () => {
        delete updateGroceryListData.itemId;

        const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['itemId']);
          expect(parsed.error.errors[0].message).toEqual('Grocery list item ID is required.');
        }
      });

      it('should return an error when the itemId is an invalid type', () => {
        (updateGroceryListData as any).itemId = 'invalid';

        const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['itemId']);
          expect(parsed.error.errors[0].message).toEqual('Grocery list item ID must be a number.');
        }
      });
    });

    describe('listId', () => {
      it('should return an error when the listId is missing', () => {
        delete updateGroceryListData.listId;

        const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['listId']);
          expect(parsed.error.errors[0].message).toEqual('Grocery list ID is required.');
        }
      });

      it('should return an error when the listId is an invalid type', () => {
        (updateGroceryListData as any).listId = 'invalid';

        const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['listId']);
          expect(parsed.error.errors[0].message).toEqual('Grocery list ID must be a number.');
        }
      });
    });

    describe('status', () => {
      it('should return an error when the status is missing', () => {
        delete updateGroceryListData.status;

        const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['status']);
          expect(parsed.error.errors[0].message).toEqual('Grocery list item status is required.');
        }
      });

      it('should return an error when the status is an invalid type', () => {
        (updateGroceryListData as any).status = 123;

        const parsed = updateGroceryListItemSchema.safeParse(updateGroceryListData);

        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['status']);
          expect(parsed.error.errors[0].message).toEqual('Invalid ingredient status found.');
        }
      });
    });
  });
});
