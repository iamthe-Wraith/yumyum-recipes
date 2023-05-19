import { describe, expect, it } from 'vitest';
import { pluralize } from './string';

describe('helpers/string', () => {
  describe('pluralize', () => {
    it('should pluralize a string', () => {
      expect(pluralize('cat', 0)).toBe('cats');
      expect(pluralize('cat', 1)).toBe('cat');
      expect(pluralize('cat', 2)).toBe('cats');
    });
  });
});