import { faker } from '@faker-js/faker';
import { IngredientType, IngredientUnitOfMeasure } from '$types/models';
import { UnitsOfMeasure } from '$lib/constants/ingredients';

export interface IMockIngredient {
  id?: number;
  amount: number;
  name: string;
  type: IngredientType;
  unit?: IngredientUnitOfMeasure;
}

export interface IMockRecipeData {
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: Partial<IMockIngredient>[];
  steps: string[];
  notes: string;
  isPublic: string;
}

const getRandomDuration = () => {
  const durOptions = ['mins', 'minutes', 'hours'];
  const durLabel = durOptions[faker.number.int({ min: 0, max: durOptions.length - 1 })];
  const dur = faker.number.int({ min: 1, max: durLabel === 'hours' ? 5 : 60 });

  return `${dur} ${durLabel}`;
};

export const getIngredient = (): IMockIngredient => {
  const types = Object.values(IngredientType);
  const type = types[faker.number.int({ min: 0, max: types.length - 1 })];
  const units = Object.values(UnitsOfMeasure).filter((u) => u.type === type);
  const unit = units[faker.number.int({ min: 0, max: units.length - 1 })].name;

  return {
    id: faker.number.int({ min: 1, max: 100000 }),
    amount: faker.number.float({ min: 0.25, max: 2, precision: 0.25 }),
    name: faker.lorem.words(faker.number.int({ min: 1, max: 3 })),
    type,
    unit,
  };
};

export const getIngredients = (count = 3): IMockIngredient[] => new Array(count).fill(null).map(() => getIngredient());

export const getRecipe = (): IMockRecipeData => {
  let name = faker.lorem.words(faker.number.int({ min: 1, max: 5 }));
  let description = faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));

  if (name.length > 50) {
    name = name.substring(0, 50);
  }

  if (description.length > 300) {
    description = description.substring(0, 300);
  }

  return {
    name,
    description,
    image: faker.image.url(),
    prepTime: getRandomDuration(),
    cookTime: getRandomDuration(),
    servings: faker.number.int({ min: 1, max: 10 }).toString(),
    ingredients: getIngredients(),
    steps: new Array(faker.number.int({ min: 1, max: 5 }))
      .fill(null)
      .map(() => faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }))),
    notes: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    isPublic: faker.datatype.boolean().toString(),
  };
};

export const getRecipes = (count = 3): IMockRecipeData[] => new Array(count).fill(null).map(() => getRecipe());
