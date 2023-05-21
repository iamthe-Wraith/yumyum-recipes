import { describe, expect, it, beforeEach } from 'vitest';
import { getNewUser, getSignIn, getUserSettings, type IMockNewUser, type IMockSignIn, type IMockUserSettings } from '../../factories/user';
import { newUserSchema, signInSchema, userSettingsSchema } from '$lib/schemas/user';

describe('schemas/user', () => {
  describe('newUserSchema', () => {
    let newUser: Partial<IMockNewUser>;
    
    beforeEach(() => {
      newUser = getNewUser();
    });

    it('should parse sign up data when data is valid', () => {
      const parsed = newUserSchema.safeParse(newUser);

      expect(parsed.success).toEqual(true);

      if (parsed.success) {
        expect(parsed.data.email).toEqual(newUser.email);
        expect(parsed.data.password).toEqual(newUser.password);
        expect(parsed.data.confirmedPassword).toEqual(newUser.confirmedPassword);
      }
    });

    describe('email', () => {
      it('should return an error when email is missing', () => {
        delete newUser.email;

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['email']);
          expect(parsed.error.errors[0].message).toEqual('Email is required.');
        }
      });

      it('should return an error when email is an invalid type', () => {
        (newUser as any).email = 123;

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['email']);
          expect(parsed.error.errors[0].message).toEqual('Email must be a string.');
        }
      });

      it('should return an error when email is invalid', () => {
        newUser.email = 'notAnEmail';

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['email']);
          expect(parsed.error.errors[0].message).toEqual('Invalid email address.');
        }
      });
    });

    describe('password', () => {
      const passwordError = 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*(),.?":{}|<>)';

      it('should return an error when password is missing', () => {
        delete newUser.password;

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual('Password is required.');
        }
      });

      it('should return an error when password is an invalid type', () => {
        (newUser as any).password = 123;

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual('Password must be a string.');
        }
      });

      it('should return an error when password does not include any capital letters', () => {
        newUser.password = 'invalid123!';

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual(passwordError);
        }
      });

      it('should return an error when password does not include any lowercase letters', () => {
        newUser.password = 'INVALID123!';

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual(passwordError);
        }
      });

      it('should return an error when password does not include any numbers', () => {
        newUser.password = 'Invalid!';

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual(passwordError);
        }
      });

      it('should return an error when password does not include any special characters', () => {
        newUser.password = 'Invalid123';

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual(passwordError);
        }
      });

      it('should return an error when password includes any invalid special characters', () => {
        newUser.password = 'Invalid123]';

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual(passwordError);
        }
      });
    });

    describe('confirmedPassword', () => {
      it('should return an error when confirmedPassword is missing', () => {
        delete newUser.confirmedPassword;

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['confirmedPassword']);
          expect(parsed.error.errors[0].message).toEqual('You must confirm your password.');
        }
      });

      it('should return an error when confirmedPassword is an invalid type', () => {
        (newUser as any).confirmedPassword = 123;

        const parsed = newUserSchema.safeParse(newUser);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['confirmedPassword']);
          expect(parsed.error.errors[0].message).toEqual('Password confirmation must be a string.');
        }
      });
    });
  });

  describe('signInSchema', () => {
    let signIn: Partial<IMockSignIn>;
    
    beforeEach(() => {
      signIn = getSignIn();
    });

    describe('email', () => {
      it('should return an error when email is missing', () => {
        delete signIn.email;

        const parsed = signInSchema.safeParse(signIn);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['email']);
          expect(parsed.error.errors[0].message).toEqual('Email is required.');
        }
      });

      it('should return an error when email is an invalid type', () => {
        (signIn as any).email = 123;

        const parsed = signInSchema.safeParse(signIn);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['email']);
          expect(parsed.error.errors[0].message).toEqual('Email must be a string.');
        }
      });

      it('should return an error when email is invalid', () => {
        signIn.email = 'notAnEmail';

        const parsed = signInSchema.safeParse(signIn);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_string');
          expect(parsed.error.errors[0].path).toEqual(['email']);
          expect(parsed.error.errors[0].message).toEqual('Invalid email address.');
        }
      });
    });

    describe('password', () => {
      it('should return an error when password is missing', () => {
        delete signIn.password;

        const parsed = signInSchema.safeParse(signIn);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual('Password is required.');
        }
      });

      it('should return an error when password is an invalid type', () => {
        (signIn as any).password = 123;

        const parsed = signInSchema.safeParse(signIn);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['password']);
          expect(parsed.error.errors[0].message).toEqual('Password must be a string.');
        }
      });
    });
  });

  describe('userSettingsSchema', () => {
    let userSettings: Partial<IMockUserSettings>;
    
    beforeEach(() => {
      userSettings = getUserSettings();
    });

    describe('defaultServingSize', () => {
      it('should return an error when defaultServingSize is missing', () => {
        delete userSettings.defaultServingSize;

        const parsed = userSettingsSchema.safeParse(userSettings);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['defaultServingSize']);
          expect(parsed.error.errors[0].message).toEqual('Default serving size is required.');
        }
      });

      it('should return an error when defaultServingSize is an invalid type', () => {
        (userSettings as any).defaultServingSize = 'invalid';

        const parsed = userSettingsSchema.safeParse(userSettings);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('invalid_type');
          expect(parsed.error.errors[0].path).toEqual(['defaultServingSize']);
          expect(parsed.error.errors[0].message).toEqual('Default serving size must be a number.');
        }
      });

      it('should return an error when defaultServingSize is not positive', () => {
        userSettings.defaultServingSize = 0;

        const parsed = userSettingsSchema.safeParse(userSettings);

        expect(parsed.success).toEqual(false);
        
        if (!parsed.success) {
          expect(parsed.error.errors[0].code).toEqual('too_small');
          expect(parsed.error.errors[0].path).toEqual(['defaultServingSize']);
          expect(parsed.error.errors[0].message).toEqual('Default servings must be a positive number.');
        }
      });
    });
  });
});
