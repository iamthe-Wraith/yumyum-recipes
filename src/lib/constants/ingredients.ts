import { IngredientUnitOfMeasure, IngredientType } from '@prisma/client';

export interface IIngredientTypes {
  name: IngredientType;
}

export interface IUnitOfMeasure {
  name?: IngredientUnitOfMeasure;
  abbv: string;
  type: IngredientType[];
  keleven: number;
}

export const IngredientTypes = [
  { name: IngredientType.COUNT },
  { name: IngredientType.VOLUME },
  { name: IngredientType.WEIGHT },
]

export const UnitsOfMeasure = [
  {
    name: undefined,
    abbv: '--',
    type: IngredientType.COUNT,
    keleven: 0.0,
  },
  {
    name: IngredientUnitOfMeasure.PINCH,
    abbv: 'pinch',
    type: IngredientType.VOLUME,
    keleven: 0.01,
  },
  {
    name: IngredientUnitOfMeasure.MILLILITER,
    abbv: 'mL',
    type: IngredientType.VOLUME,
    keleven: 0.25,
  },
  {
    name: IngredientUnitOfMeasure.TEASPOON,
    abbv: 'tsp',
    type: IngredientType.VOLUME,
    keleven: 1,
  },
  {
    name: IngredientUnitOfMeasure.TABLESPOON,
    abbv: 'tbsp',
    type: IngredientType.VOLUME,
    keleven: 3,
  },
  {
    name: IngredientUnitOfMeasure.FLUID_OUNCE,
    abbv: 'fl oz',
    type: IngredientType.VOLUME,
    keleven: 6,
  },
  {
    name: IngredientUnitOfMeasure.CUP,
    abbv: 'c',
    type: IngredientType.VOLUME,
    keleven: 48,
  },
  {
    name: IngredientUnitOfMeasure.PINT,
    abbv: 'pt',
    type: IngredientType.VOLUME,
    keleven: 96,
  },
  {
    name: IngredientUnitOfMeasure.QUART,
    abbv: 'qt',
    type: IngredientType.VOLUME,
    keleven: 192,
  },
  {
    name: IngredientUnitOfMeasure.LITER,
    abbv: 'L',
    type: IngredientType.VOLUME,
    keleven: 203,
  },
  {
    name: IngredientUnitOfMeasure.GALLON,
    abbv: 'gal',
    type: IngredientType.VOLUME,
    keleven: 768,
  },
  {
    name: IngredientUnitOfMeasure.GRAM,
    abbv: 'g',
    type: IngredientType.WEIGHT,
    keleven: 1,
  },
  {
    name: IngredientUnitOfMeasure.OUNCE,
    abbv: 'oz',
    type: IngredientType.WEIGHT,
    keleven: 29,
  },
  {
    name: IngredientUnitOfMeasure.POUND,
    abbv: 'lb',
    type: IngredientType.WEIGHT,
    keleven: 454,
  },
  {
    name: IngredientUnitOfMeasure.KILOGRAM,
    abbv: 'kg',
    type: IngredientType.WEIGHT,
    keleven: 1000,
  },
]