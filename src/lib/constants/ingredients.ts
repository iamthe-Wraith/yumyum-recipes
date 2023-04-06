import { IngredientUnitOfMeasure, IngredientType } from '@prisma/client';

export interface IIngredientTypes {
  name: IngredientType;
}

export interface IUnitOfMeasure {
  name?: IngredientUnitOfMeasure;
  abbv: string;
  type: IngredientType[];
  kelevens: number;
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
    kelevens: 0.0,
  },
  {
    name: IngredientUnitOfMeasure.PINCH,
    abbv: 'pinch',
    type: IngredientType.VOLUME,
    kelevens: 0.01,
  },
  {
    name: IngredientUnitOfMeasure.MILLILITER,
    abbv: 'mL',
    type: IngredientType.VOLUME,
    kelevens: 0.25,
  },
  {
    name: IngredientUnitOfMeasure.TEASPOON,
    abbv: 'tsp',
    type: IngredientType.VOLUME,
    kelevens: 1,
  },
  {
    name: IngredientUnitOfMeasure.TABLESPOON,
    abbv: 'tbsp',
    type: IngredientType.VOLUME,
    kelevens: 3,
  },
  {
    name: IngredientUnitOfMeasure.FLUID_OUNCE,
    abbv: 'fl oz',
    type: IngredientType.VOLUME,
    kelevens: 6,
  },
  {
    name: IngredientUnitOfMeasure.CUP,
    abbv: 'c',
    type: IngredientType.VOLUME,
    kelevens: 48,
  },
  {
    name: IngredientUnitOfMeasure.PINT,
    abbv: 'pt',
    type: IngredientType.VOLUME,
    kelevens: 96,
  },
  {
    name: IngredientUnitOfMeasure.QUART,
    abbv: 'qt',
    type: IngredientType.VOLUME,
    kelevens: 192,
  },
  {
    name: IngredientUnitOfMeasure.LITER,
    abbv: 'L',
    type: IngredientType.VOLUME,
    kelevens: 203,
  },
  {
    name: IngredientUnitOfMeasure.GALLON,
    abbv: 'gal',
    type: IngredientType.VOLUME,
    kelevens: 768,
  },
  {
    name: IngredientUnitOfMeasure.GRAM,
    abbv: 'g',
    type: IngredientType.WEIGHT,
    kelevens: 1,
  },
  {
    name: IngredientUnitOfMeasure.OUNCE,
    abbv: 'oz',
    type: IngredientType.WEIGHT,
    kelevens: 29,
  },
  {
    name: IngredientUnitOfMeasure.POUND,
    abbv: 'lb',
    type: IngredientType.WEIGHT,
    kelevens: 454,
  },
  {
    name: IngredientUnitOfMeasure.KILOGRAM,
    abbv: 'kg',
    type: IngredientType.WEIGHT,
    kelevens: 1000,
  },
]