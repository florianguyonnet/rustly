import '../src/promise-helper';

import { describe, expect, it } from 'vitest';

import { Err, Ok } from '../src/result';

describe('Promise helper', () => {
  describe('thenOnOk', () => {
    it('should call the Ok callback and unwrap value if result is Ok', async () => {
      const promise = Promise.resolveFromOk(1);

      const resultValue = await promise.thenOnOk((value) => {
        return value;
      });

      expect(resultValue).toBe(1);
    });

    it('should not call the Ok callback and unwrap value if result is Ok', async () => {
      const promise = Promise.resolveFromErr(1);

      const resultValue = await promise.thenOnOk((value) => {
        return value;
      });

      expect(resultValue).not.toBe(1);
    });
  });

  describe('thenOnErr', () => {
    it('should call the Err callback and unwrap value if result is Err', async () => {
      const promise = Promise.resolveFromErr(1);

      const resultValue = await promise.thenOnErr((value) => {
        return value;
      });

      expect(resultValue).toBe(1);
    });

    it('should not call the Err callback and unwrap value if result is Err', async () => {
      const promise = Promise.resolveFromOk(1);

      const resultValue = await promise.thenOnErr((value) => {
        return value;
      });

      expect(resultValue).not.toBe(1);
    });
  });
});
