import { describe, expect, it } from 'vitest';
import { isErrorStatus } from './response';

describe('helpers/response', () => {
  describe('isErrorStatus', () => {
    it('should return true if status is 400 or greater', () => {
      expect(isErrorStatus(400)).toBe(true);
      expect(isErrorStatus(401)).toBe(true);
      expect(isErrorStatus(403)).toBe(true);
      expect(isErrorStatus(404)).toBe(true);
      expect(isErrorStatus(500)).toBe(true);
    });

    it('should return false if status is less than 400', () => {
      expect(isErrorStatus(200)).toBe(false);
      expect(isErrorStatus(201)).toBe(false);
      expect(isErrorStatus(203)).toBe(false);
      expect(isErrorStatus(204)).toBe(false);
    });
  });
});