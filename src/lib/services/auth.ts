import { HASH_SALT_ROUNDS } from '$lib/constants/auth';
import { HttpStatus } from '$lib/constants/error';
import { ApiError } from '$lib/error';
import bcrypt from 'bcrypt';

export const generatePasswordHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (password) {
      bcrypt.genSalt(HASH_SALT_ROUNDS, (err: Error | undefined, salt: string) => {
        if (err) {
          reject(err);
        } else {
          bcrypt.hash(password, salt, (error: Error | undefined, hash: string) => {
            if (error) {
              reject(error);
            } else {
              resolve(hash);
            }
          });
        }
      });
    } else {
      reject(new ApiError('Password is required.', HttpStatus.INVALID_ARG, 'password'));
    }
  });
};

export const isValidPassword = (providedPassword: string, encryptedPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(providedPassword, encryptedPassword, (err: Error | undefined, authenticated: boolean) => {
      if (err) {
        reject(err);
      } else {
        if (authenticated) {
          resolve();
        } else {
          reject(new ApiError('Invalid email or password.', HttpStatus.AUTHENTICATION));
        }
      }
    });
  });
}
