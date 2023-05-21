import { describe, expect, it } from 'vitest';
import { generatePasswordHash, isValidPassword } from '$lib/services/auth';

describe('services/auth', () => {
  describe('generatePasswordHash', () => {
    const password = 'password';

    it('should return a password hash if a valid string is passed', async () => {
      const hash = await generatePasswordHash(password);

      expect(hash).toBeDefined();
    });

    it('should throw error if an empty string is passed', async () => {
      try {
        await generatePasswordHash('');
      } catch (err: any) {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Password is required.');
      }
    });

    it('should throw error if no string is passed', async () => {
      const password: string | undefined = undefined;

      try {
        await generatePasswordHash(password as unknown as string);
      } catch (err: any) {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Password is required.');
      }
    });
  });

  describe('isValidPassword', () => {
    it('should return true if the provided password matches the encrypted password', async () => {
      const password = 'password';
      const hash = await generatePasswordHash(password);

      const authenticated = await isValidPassword(password, hash);

      expect(authenticated).toBeTruthy();
    });

    it('should throw error if the provided password does not match the encrypted password', async () => {
      const password = 'password';
      const hash = await generatePasswordHash(password);

      try {
        await isValidPassword('wrong password', hash);
      } catch (err: any) {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Invalid email or password.');
      }
    });

    it('should throw error if the provided password is not passed', async () => {
      const password = 'password';
      const invalidPassword: string | undefined = undefined;
      const hash = await generatePasswordHash(password);

      try {
        await isValidPassword(invalidPassword as unknown as string, hash);
      } catch (err: any) {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Invalid email or password.');
      }
    });

    it('should throw error if the encrypted password is not passed', async () => {
      const password = 'password';
      const invalidPassword: string | undefined = undefined;

      try {
        await isValidPassword(password, invalidPassword as unknown as string);
      } catch (err: any) {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Invalid email or password.');
      }
    });
  });
});