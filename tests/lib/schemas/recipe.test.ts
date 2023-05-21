/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, expect, it, beforeEach } from 'vitest';
import { recipeSchema } from '../../../src/lib/schemas/recipe';
import { getRecipe, type IMockRecipeData } from '../../factories/recipes';

let recipe: Partial<IMockRecipeData>;

describe('schemas/recipe', () => {
  beforeEach(() => {
    recipe = getRecipe();
  });

  it('should parse recipe data when data is valid', () => {
    const parsed = recipeSchema.safeParse(recipe);

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.name).toEqual(recipe.name);
      expect(parsed.data.description).toEqual(recipe.description);
      expect(parsed.data.prepTime).toEqual(recipe.prepTime);
      expect(parsed.data.cookTime).toEqual(recipe.cookTime);
      expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
      expect(parsed.data.ingredients).toEqual(recipe.ingredients);
      expect(parsed.data.steps).toEqual(recipe.steps);
      expect(parsed.data.notes).toEqual(recipe.notes);
      expect(parsed.data.isPublic).toEqual(recipe.isPublic === 'true');
    }
  });

  describe('name', () => {
    it('should return an error when the recipe name is missing', () => {
      delete recipe.name;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['name']);
        expect(parsed.error.errors[0].message).toEqual('Recipe name is required.');
      }
    });
  
    it('should return an error when the recipe name is an invalid type', () => {
      (recipe as any).name = 123;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['name']);
        expect(parsed.error.errors[0].message).toEqual('Recipe name must be a string.');
      }
    });
  
    it('should return an error when the recipe name is too long', () => {
      recipe.name = 'This is a name that is longer too long and will throw and error.';
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('too_big');
        expect(parsed.error.errors[0].path).toEqual(['name']);
        expect(parsed.error.errors[0].message).toEqual('Recipe name cannot be more than 50 characters.');
      }
    });
  });

  describe('description', () => {
    it('should return an error when the recipe description is missing', () => {
      delete recipe.description;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['description']);
        expect(parsed.error.errors[0].message).toEqual('Recipe description is required.');
      }
    });
  
    it('should return an error when the recipe description is an invalid type', () => {
      (recipe as any).description = 123;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['description']);
        expect(parsed.error.errors[0].message).toEqual('Recipe description must be a string.');
      }
    });
  
    it('should return an error when the recipe description is too long', () => {
      recipe.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.';
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('too_big');
        expect(parsed.error.errors[0].path).toEqual(['description']);
        expect(parsed.error.errors[0].message).toEqual('Recipe description cannot be more than 300 characters.');
      }
    });
  });

  describe('prepTime', () => {
    it('should return an error when the recipe prepTime is missing', () => {
      delete recipe.prepTime;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['prepTime']);
        expect(parsed.error.errors[0].message).toEqual('Prep time is required.');
      }
    });

    it('should return an error when the recipe prepTime is an invalid type', () => {
      (recipe as any).prepTime = 123;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['prepTime']);
        expect(parsed.error.errors[0].message).toEqual('Prep time must be a string.');
      }
    });

    it('should return an error when the recipe prepTime is not written in minutes or hours', () => {
      (recipe as any).prepTime = '123';
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_string');
        expect(parsed.error.errors[0].path).toEqual(['prepTime']);
        expect(parsed.error.errors[0].message).toEqual('Prep time must be in minutes and hours.');
      }
    });
  });

  describe('cookTime', () => {
    it('should return an error when the recipe cookTime is missing', () => {
      delete recipe.cookTime;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['cookTime']);
        expect(parsed.error.errors[0].message).toEqual('Cook time is required.');
      }
    });

    it('should return an error when the recipe cookTime is an invalid type', () => {
      (recipe as any).cookTime = 123;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['cookTime']);
        expect(parsed.error.errors[0].message).toEqual('Cook time must be a string.');
      }
    });

    it('should return an error when the recipe cookTime is not written in minutes or hours', () => {
      (recipe as any).cookTime = '123';
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_string');
        expect(parsed.error.errors[0].path).toEqual(['cookTime']);
        expect(parsed.error.errors[0].message).toEqual('Cook time must be in minutes and hours.');
      }
    });
  });

  describe('servings', () => {
    it('should return an error when the recipe servings are missing', () => {
      delete recipe.servings;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['servings']);
        expect(parsed.error.errors[0].message).toEqual('Servings are required.');
      }
    });

    it('should return an error when the recipe servings is an invalid type', () => {
      (recipe as any).servings = 'invalid';
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['servings']);
        expect(parsed.error.errors[0].message).toEqual('Servings must be a number.');
      }
    });

    it('should return an error when the recipe servings is a negative number', () => {
      (recipe as any).servings = '-1';
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('too_small');
        expect(parsed.error.errors[0].path).toEqual(['servings']);
        expect(parsed.error.errors[0].message).toEqual('Servings must be a positive number.');
      }
    });

    it('should return an error when the recipe servings is 0', () => {
      (recipe as any).servings = 0;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('too_small');
        expect(parsed.error.errors[0].path).toEqual(['servings']);
        expect(parsed.error.errors[0].message).toEqual('Servings must be a positive number.');
      }
    });
  });

  describe('ingredients', () => {
    describe('id', () => {
      it('should not throw an error if an ingredient id is missing', () => {
        delete recipe.ingredients![0].id;

        const parsed = recipeSchema.safeParse(recipe);

        expect(parsed.success).toBe(true);

        if (parsed.success) {
          expect(parsed.data.name).toEqual(recipe.name);
          expect(parsed.data.description).toEqual(recipe.description);
          expect(parsed.data.prepTime).toEqual(recipe.prepTime);
          expect(parsed.data.cookTime).toEqual(recipe.cookTime);
          expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
          expect(parsed.data.ingredients).toEqual(recipe.ingredients);
          expect(parsed.data.steps).toEqual(recipe.steps);
          expect(parsed.data.notes).toEqual(recipe.notes);
          expect(parsed.data.isPublic).toEqual(recipe.isPublic === 'true');
        }
      });

      it('should return an error when an ingredient id is an invalid type', () => {
        (recipe.ingredients![0] as any).id = 'invalid';
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'id']);
          expect(parsed.error.errors[0].message).toEqual('Ingredient IDs must be a number.');
        }
      });
    });

    describe('amount', () => {
      it('should return an error when an ingredient amount is missing', () => {
        delete recipe.ingredients![0].amount;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'amount']);
          expect(parsed.error.errors[0].message).toEqual('Each ingredient must specify an amount.');
        }
      });

      it('should return an error when an ingredient amount is an invalid type', () => {
        (recipe.ingredients![0] as any).amount = 'invalid';
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'amount']);
          expect(parsed.error.errors[0].message).toEqual('Ingredient amounts must be a number.');
        }
      });

      it('should return an error when an ingredient amount is not positive', () => {
        (recipe.ingredients![0] as any).amount = 0;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('too_small');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'amount']);
          expect(parsed.error.errors[0].message).toEqual('Ingredient amounts must be greater than 0.');
        }
      });
    });

    describe('type', () => {
      it('should return an error when an ingredient type is missing', () => {
        delete recipe.ingredients![0].type;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'type']);
          expect(parsed.error.errors[0].message).toEqual('Each ingredient must specify a type.');
        }
      });

      it('should return an error when an ingredient amount is an invalid datatype', () => {
        (recipe.ingredients![0] as any).type = 123;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'type']);
          expect(parsed.error.errors[0].message).toEqual('Invalid ingredient type found.');
        }
      });

      it('should return an error when an ingredient amount is an invalid IngredientType', () => {
        (recipe.ingredients![0] as any).type = 'invalid';
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_enum_value');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'type']);
          expect(parsed.error.errors[0].message).toEqual('Invalid enum value. Expected \'VOLUME\' | \'WEIGHT\' | \'COUNT\', received \'invalid\'');
        }
      });
    });

    describe('unit', () => {
      it('should not return an error when an ingredient unit is missing', () => {
        delete recipe.ingredients![0].unit;

        const parsed = recipeSchema.safeParse(recipe);

        expect(parsed.success).toBe(true);

        if (parsed.success) {
          expect(parsed.data.name).toEqual(recipe.name);
          expect(parsed.data.description).toEqual(recipe.description);
          expect(parsed.data.prepTime).toEqual(recipe.prepTime);
          expect(parsed.data.cookTime).toEqual(recipe.cookTime);
          expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
          expect(parsed.data.ingredients).toEqual(recipe.ingredients);
          expect(parsed.data.steps).toEqual(recipe.steps);
          expect(parsed.data.notes).toEqual(recipe.notes);
          expect(parsed.data.isPublic).toEqual(recipe.isPublic === 'true');
        }
      });

      it('should not return an error when an ingredient unit is null', () => {
        (recipe.ingredients![0] as any).unit = null;

        const parsed = recipeSchema.safeParse(recipe);

        expect(parsed.success).toBe(true);

        if (parsed.success) {
          expect(parsed.data.name).toEqual(recipe.name);
          expect(parsed.data.description).toEqual(recipe.description);
          expect(parsed.data.prepTime).toEqual(recipe.prepTime);
          expect(parsed.data.cookTime).toEqual(recipe.cookTime);
          expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
          expect(parsed.data.ingredients).toEqual(recipe.ingredients);
          expect(parsed.data.steps).toEqual(recipe.steps);
          expect(parsed.data.notes).toEqual(recipe.notes);
          expect(parsed.data.isPublic).toEqual(recipe.isPublic === 'true');
        }
      });

      it('should return an error when an ingredient unit is an invalid datatype', () => {
        (recipe.ingredients![0] as any).unit = 123;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'unit']);
          expect(parsed.error.errors[0].message).toEqual('Invalid ingredient unit found.');
        }
      });

      it('should return an error when an ingredient unit is an invalid IngredientType', () => {
        (recipe.ingredients![0] as any).unit = 'invalid';
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_enum_value');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'unit']);
          expect(parsed.error.errors[0].message).toEqual('Invalid enum value. Expected \'PINCH\' | \'TEASPOON\' | \'TABLESPOON\' | \'CUP\' | \'PINT\' | \'QUART\' | \'GALLON\' | \'POUND\' | \'MILLILITER\' | \'LITER\' | \'GRAM\' | \'OUNCE\' | \'FLUID_OUNCE\' | \'KILOGRAM\', received \'invalid\'');
        }
      });
    });

    describe('name', () => {
      it('should return an error when an ingredient name is missing', () => {
        delete recipe.ingredients![0].name;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'name']);
          expect(parsed.error.errors[0].message).toEqual('Each ingredient must have a name.');
        }
      });

      it('should return an error when an ingredient name is an empty string', () => {
        recipe.ingredients![0].name = '';
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('too_small');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'name']);
          expect(parsed.error.errors[0].message).toEqual('Ingredient names must be at least 1 character.');
        }
      });

      it('should return an error when an ingredient name is an invalid type', () => {
        (recipe.ingredients![0] as any).name = 123;
    
        const parsed = recipeSchema.safeParse(recipe);
    
        expect(parsed.success).toBe(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['ingredients', 0, 'name']);
          expect(parsed.error.errors[0].message).toEqual('Ingredient names must be a string.');
        }
      });
    });
  });

  describe('steps', () => {
    it('should return an error when the recipe steps are missing', () => {
      delete recipe.steps;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['steps']);
        expect(parsed.error.errors[0].message).toEqual('Recipe steps are required.');
      }
    });

    it('should return an error when the recipe steps are an empty array', () => {
      recipe.steps = [];
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('too_small');
        expect(parsed.error.errors[0].path).toEqual(['steps']);
        expect(parsed.error.errors[0].message).toEqual('Recipes must have at least 1 step.');
      }
    });

    it('should return an error when the recipe steps contain an invalid data type', () => {
      (recipe as any).steps = [123];
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['steps', 0]);
        expect(parsed.error.errors[0].message).toEqual('Recipe steps must be a string.');
      }
    });
  });

  describe('notes', () => {
    it('should not throw an error if notes are missing', () => {
      delete recipe.notes;

      const parsed = recipeSchema.safeParse(recipe);

      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.name).toEqual(recipe.name);
        expect(parsed.data.description).toEqual(recipe.description);
        expect(parsed.data.prepTime).toEqual(recipe.prepTime);
        expect(parsed.data.cookTime).toEqual(recipe.cookTime);
        expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
        expect(parsed.data.ingredients).toEqual(recipe.ingredients);
        expect(parsed.data.steps).toEqual(recipe.steps);
        expect(parsed.data.notes).toEqual(recipe.notes);
        expect(parsed.data.isPublic).toEqual(recipe.isPublic === 'true');
      }
    });

    it('should return an error when the notes are of an invalid type', () => {
      (recipe as any).notes = 123;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['notes']);
        expect(parsed.error.errors[0].message).toEqual('Notes must be a string.');
      }
    });
  });

  describe('isPublic', () => {
    it('should not throw an error if isPublic is missing are missing', () => {
      delete recipe.isPublic;

      const parsed = recipeSchema.safeParse(recipe);

      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.name).toEqual(recipe.name);
        expect(parsed.data.description).toEqual(recipe.description);
        expect(parsed.data.prepTime).toEqual(recipe.prepTime);
        expect(parsed.data.cookTime).toEqual(recipe.cookTime);
        expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
        expect(parsed.data.ingredients).toEqual(recipe.ingredients);
        expect(parsed.data.steps).toEqual(recipe.steps);
        expect(parsed.data.notes).toEqual(recipe.notes);
        expect(parsed.data.isPublic).toEqual(recipe.isPublic === 'true');
      }
    });

    it('should not throw an error if isPublic does not equal "true" or "false"', () => {
      recipe.isPublic = 'invalid';

      const parsed = recipeSchema.safeParse(recipe);

      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.name).toEqual(recipe.name);
        expect(parsed.data.description).toEqual(recipe.description);
        expect(parsed.data.prepTime).toEqual(recipe.prepTime);
        expect(parsed.data.cookTime).toEqual(recipe.cookTime);
        expect(parsed.data.servings).toEqual(parseInt(recipe.servings!, 10));
        expect(parsed.data.ingredients).toEqual(recipe.ingredients);
        expect(parsed.data.steps).toEqual(recipe.steps);
        expect(parsed.data.notes).toEqual(recipe.notes);
        expect(parsed.data.isPublic).toEqual(false);
      }
    });

    it('should return an error when the isPublic is of an invalid type', () => {
      (recipe as any).isPublic = 123;
  
      const parsed = recipeSchema.safeParse(recipe);
  
      expect(parsed.success).toBe(false);
      
      if (!parsed.success) {
        expect(parsed.error.errors[0].code).toEqual('invalid_type');
        expect(parsed.error.errors[0].path).toEqual(['isPublic']);
        expect(parsed.error.errors[0].message).toEqual('isPublic must be a string.');
      }
    });
  });
});