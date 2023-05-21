import { describe, expect, it } from 'vitest';
import { parseFormData } from '../../../src/lib/helpers/request';

interface IMockBasicFormData {
  username: string;
  email: string;
}

interface IMockArrayFormData {
  ingredients: string[];
}

interface IMockFileFormData {
  image: File;
}

const username = 'pizzaLover';
const email = 'pizza@yumyum.recipes';
const ingredients = ['cheese', 'pepperoni', 'sauce'];
const image = new File(['foo'], 'foo.png', { type: 'image/png' });

describe('helpers/request', () => {
  describe('parseFormData', () => {
    it('should parse basic form data', () => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);

      parseFormData<IMockBasicFormData>({ formData } as unknown as Request)
        .then(parsed => {
          expect(parsed.username).toEqual(username);
          expect(parsed.email).toEqual(email);
        });
    });

    it('should parse form data that includes an array', () => {
      const formData = new FormData();
      ingredients.forEach(ingredient => {
        formData.append('ingredients[]', ingredient);
      });

      parseFormData<IMockArrayFormData>({ formData } as unknown as Request)
        .then(parsed => {
          expect(parsed.ingredients.length).toEqual(ingredients.length);
          ingredients.forEach(ingredient => {
            expect(parsed.ingredients).toContain(ingredient);
          });
        });
    });

    it('should parse form data that includes a file', () => {
      const formData = new FormData();
      formData.append('image', image);

      parseFormData<IMockFileFormData>({ formData } as unknown as Request)
        .then(parsed => {
          expect(parsed.image).toBeDefined();
        });
    });

    it('should parse form data when is empty', () => {
      const formData = new FormData();

      parseFormData<IMockFileFormData>({ formData } as unknown as Request)
        .then(parsed => {
          expect(Object.values(parsed).length).toEqual(0);
        });
    });
  });
});
