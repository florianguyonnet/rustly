import { describe, expect, it } from 'vitest';

import { Some } from '../src/option';

describe('option', () => {
  describe('isSome', () => {
    it('should return true if the option is Some', () => {
      expect(Some(1).isSome()).toBe(true);
    });
  });
});
