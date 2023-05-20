import { describe, expect, it } from 'vitest';
import { UnitsOfMeasure } from '$lib/constants/ingredients';
import { getUnitOfMeasure, getUnitOfMeasureAbbv } from './units_of_measure';
import { IngredientUnitOfMeasure } from '$types/models';

describe('helpers/units_of_measure', () => {
  describe('getUnitOfMeasure', () => {
    it('should return the unit of measure', () => {
      Object.values(UnitsOfMeasure).forEach(uom => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const result = getUnitOfMeasure(uom.name!);
        expect(result).toBeDefined();
        expect(result).toEqual(uom);
      });
    });

    it('should return undefined if unit of measure is not found', () => {
      const result = getUnitOfMeasure('foo');
      expect(result).toBeUndefined();
    });
  });

  describe('getUnitOfMeasureAbbv', () => {
    describe('when no amount is provided', () => {
      it('should return the abbreviation of the unit of measure when the string matches the name of a unit of measure', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.CUP)!;
        const result = getUnitOfMeasureAbbv(uom.name as string);
        expect(result).toEqual(uom.abbv);
      });
  
      it('should return an empty string when no unit of measure is passed', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => !u.name)!;
        const result = getUnitOfMeasureAbbv(undefined);
        expect(result).toEqual(uom.abbv);
      });
  
      it('should return the abbreviation of the unit of measure when a valid unit of measure object is passed', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.CUP)!;
        const result = getUnitOfMeasureAbbv(uom);
        expect(result).toEqual(uom.abbv);
      });
    });

    describe('when an amount of 1 is provided', () => {
      it('should return the abbreviation of the unit of measure when the string matches the name of a unit of measure', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.CUP)!;
        const result = getUnitOfMeasureAbbv(uom.name as string, 1);
        expect(result).toEqual(uom.abbv);
      });
  
      it('should return an empty string when no unit of measure is passed', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => !u.name)!;
        const result = getUnitOfMeasureAbbv(undefined, 1);
        expect(result).toEqual(uom.abbv);
      });
  
      it('should return the abbreviation of the unit of measure when a valid unit of measure object is passed', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.CUP)!;
        const result = getUnitOfMeasureAbbv(uom, 1);
        expect(result).toEqual(uom.abbv);
      });
    });

    describe('when an amount other than 1 is provided', () => {
      it('should return the abbreviation of the unit of measure when the string matches the name of a unit of measure', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.CUP)!;
        const result = getUnitOfMeasureAbbv(uom.name as string, 3);
        expect(result).toEqual(uom.abbv);
      });
  
      it('should return an empty string when no unit of measure is passed', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => !u.name)!;
        const result = getUnitOfMeasureAbbv(undefined, 3);
        expect(result).toEqual(uom.abbv);
      });
  
      it('should return the abbreviation of the unit of measure when a valid unit of measure object is passed', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.CUP)!;
        const result = getUnitOfMeasureAbbv(uom, 3);
        expect(result).toEqual(uom.abbv);
      });

      it('should return pluralized abbreviation of the unit of measure when unit of measure name is PINCH', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.PINCH)!;
        const result = getUnitOfMeasureAbbv(uom, 3);
        expect(result).toEqual(`${uom.abbv}es`);
      });

      it('should return pluralized abbreviation of the unit of measure when unit of measure name is MILLILITER', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.MILLILITER)!;
        const result = getUnitOfMeasureAbbv(uom, 3);
        expect(result).toEqual(`${uom.abbv}s`);
      });

      it('should return pluralized abbreviation of the unit of measure when unit of measure name is POUND', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const uom = UnitsOfMeasure.find(u => u.name === IngredientUnitOfMeasure.POUND)!;
        const result = getUnitOfMeasureAbbv(uom, 3);
        expect(result).toEqual(`${uom.abbv}s`);
      });
    });
  });
});