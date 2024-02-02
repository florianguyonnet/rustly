import { describe, expect, it } from 'vitest';

import { None, Some } from '../src/option';
import { OPTION_TYPE_RUSTLY_HASH_IDENTIFIER } from '../src/utils';

const ERROR_OPTION_SHOULD_BE_SOME = 'Option should be of type Some';
const ERROR_OPTION_SHOULD_BE_NONE = 'Option should be of type None';

describe('option', () => {
  describe('isSome', () => {
    it('should return true if the option is Some', () => {
      expect(Some(1).isSome()).toBeTruthy();
    });

    it('should return false if the option is None', () => {
      expect(None().isSome()).toBeFalsy();
    });
  });

  describe('isNone', () => {
    it('should return true if the option is None', () => {
      expect(None().isNone()).toBeTruthy();
    });

    it('should return false if the option is Some', () => {
      expect(Some(1).isNone()).toBeFalsy();
    });
  });

  describe('isSomeAnd', () => {
    it('should return true if the option is Some and the predicate is true', () => {
      expect(Some(1).isSomeAnd((value) => value === 1)).toBeTruthy();
    });

    it('should return false if the option is Some and the predicate is false', () => {
      expect(Some(1).isSomeAnd((value) => value === 2)).toBeFalsy();
    });

    it('should return false if the option is None', () => {
      expect(None().isSomeAnd((value) => value === 1)).toBeFalsy();
    });
  });

  describe('isNoneAnd', () => {
    it('should return true if the option is None and the predicate is true', () => {
      expect(None().isNoneAnd(() => true)).toBeTruthy();
    });

    it('should return false if the option is None and the predicate is false', () => {
      expect(None().isNoneAnd(() => false)).toBeFalsy();
    });

    it('should return false if the option is Some', () => {
      expect(Some(1).isNoneAnd(() => true)).toBeFalsy();
    });
  });

  describe('unwrap', () => {
    it('should return the value if the option is Some', () => {
      expect(Some(1).unwrap()).toBe(1);
    });

    it('should throw an error if the option is None', () => {
      expect(() => None().unwrap()).toThrowError(ERROR_OPTION_SHOULD_BE_SOME);
    });
  });

  describe('unwrapOr', () => {
    it('should return the value if the option is Some', () => {
      expect(Some(1).unwrapOr(2)).toBe(1);
    });

    it('should return the default value if the option is None', () => {
      expect(None().unwrapOr(2)).toBe(2);
    });

    it('should return the value of the function if the option is None', () => {
      expect(None().unwrapOr(() => 2)).toBe(2);
    });
  });

  describe('unwrapNone', () => {
    it('should return undefined if the option is None', () => {
      expect(None().unwrapNone()).toBeUndefined();
    });

    it('should throw an error if the option is Some', () => {
      expect(() => Some(1).unwrapNone()).toThrowError(ERROR_OPTION_SHOULD_BE_NONE);
    });
  });

  describe('expect', () => {
    it('should return the value if the option is Some', () => {
      expect(Some(1).expect('error message')).toBe(1);
    });

    it('should throw an error if the option is None', () => {
      expect(() => None().expect('error message')).toThrowError('error message');
    });
  });

  describe('insert', () => {
    it('should insert the value if the option is None', () => {
      const option = None();
      const result = option.insert(1);

      expect(option.isSome()).toBeTruthy();
      expect(option.unwrap()).toBe(1);
      expect(result).toBe(option);
    });

    it('should insert the value if the option is Some', () => {
      const option = Some(1);
      const result = option.insert(2);

      expect(option.isSome()).toBeTruthy();
      expect(option.unwrap()).toBe(2);
      expect(result).toBe(option);
    });
  });

  describe('take', () => {
    it('should return the value if the option is Some', () => {
      const option = Some(1);
      const result = option.take();

      expect(option.isNone()).toBeTruthy();
      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(1);
    });

    it('should return None if the option is None', () => {
      const option = None();
      const result = option.take();

      expect(option.isNone()).toBeTruthy();
      expect(result.isNone()).toBeTruthy();
    });
  });

  describe('replace', () => {
    it('should replace the value if the option is Some', () => {
      const option = Some(1);
      const result = option.replace(2);

      expect(option.isSome()).toBeTruthy();
      expect(option.unwrap()).toBe(2);
      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(1);
    });

    it('should replace the value if the option is None', () => {
      const option = None();
      const result = option.replace(2);

      expect(option.isSome()).toBeTruthy();
      expect(option.unwrap()).toBe(2);
      expect(result.isNone()).toBeTruthy();
    });
  });

  describe('map', () => {
    it('should return the mapped value if the option is Some', () => {
      const option = Some(1);
      const result = option.map((value) => value + 1);

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(2);
    });

    it('should return None if the option is None', () => {
      const option = None<number>();
      const result = option.map((value) => value + 1);

      expect(result.isNone()).toBeTruthy();
    });
  });

  describe('mapOr', () => {
    it('should return the mapped value if the option is Some', () => {
      const option = Some(1);
      const result = option.mapOr(2, (value) => value + 1);

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(2);
    });

    it('should return the default value if the option is None', () => {
      const option = None<number>();
      const result = option.mapOr(2, (value) => value + 1);

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(2);
    });

    it('should return the default function value if the option is None', () => {
      const option = None<number>();
      const result = option.mapOr(() => 2, (value) => value + 1);

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(2);
    });
  });

  describe('okOr', () => {
    it('should return Ok if the option is Some', () => {
      const option = Some(1);
      const result = option.okOr(2);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBe(1);
    });

    it('should return Err if the option is None', () => {
      const option = None<number>();
      const result = option.okOr(2);

      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBe(2);
    });

    it('should return Ok if the option is Some', () => {
      const option = Some(1);
      const result = option.okOr(() => 2);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBe(1);
    });

    it('should return Err if the option is None', () => {
      const option = None<number>();
      const result = option.okOr(() => 2);

      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBe(2);
    });
  });

  describe('or', () => {
    it("should return current option if it's a Some", () => {
      const option = Some(1);
      const result = option.or(Some(2));

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(1);
    });

    it('should return the argument option if the current option is None', () => {
      const option = None();
      const result = option.or(Some(2));

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(2);
    });
  });

  describe('and', () => {
    it('should return the argument option if the current option is Some', () => {
      const option = Some(1);
      const result = option.and(Some(2));

      expect(result.isSome()).toBeTruthy();
      expect(result.unwrap()).toBe(2);
    });

    it("should return current option if it's a None", () => {
      const option = None();
      const result = option.and(Some(2));

      expect(result.isNone()).toBeTruthy();
    });
  });

  describe('[get] rustlyHashIdentifier', () => {
    it('should return the rustly hash identifier', () => {
      const option = Some();
      expect(option.rustlyHashIdentifier).toEqual(OPTION_TYPE_RUSTLY_HASH_IDENTIFIER);
    });
  });
});

describe('Some', () => {
  it('should return a Some option with a boolean value', () => {
    const option = Some(true);
    expect(option.isSome()).toBeTruthy();
    expect(option.unwrap()).toBeTruthy();
  });

  it('should return a Some option with an undefined value', () => {
    const option = Some();
    expect(option.isSome()).toBeTruthy();
    expect(option.unwrap()).toBe(undefined);
  });
});

describe('None', () => {
  it('should return a None option', () => {
    const option = None();
    expect(option.isNone()).toBeTruthy();
    expect(option.unwrapNone()).toBeUndefined();
  });
});

describe('match', () => {
  it('should match a Some with the "some" case', () => {
    const option = Some('Some text');
    let success!: boolean;
    option.match({
      some() {
        success = true;
      },
      none() {
        success = false;
      },
    });
    expect(success).toBeTruthy();
  });

  it('should match an None with the "none" case', () => {
    const option = None();
    let success!: boolean;
    option.match({
      some() {
        success = true;
      },
      none() {
        success = false;
      },
    });
    expect(success).toBeFalsy();
  });

  it('should give a value for the "some" case', () => {
    const option = Some(2);
    option.match({
      some(data) {
        expect(data).toBe(2);
      },
      none() {},
    });
  });

  it('should allow for values to be returned by "some" case', () => {
    const option = Some(4);
    const value = option.match({
      some(data) {
        return data + 1;
      },
      none() {
        return 0;
      },
    });
    expect(value).toBe(5);
  });

  it('should allow for values to be returned by "none" case', () => {
    const option = None<number>();
    const value = option.match({
      some(data) {
        return data + 1;
      },
      none() {
        return 0;
      },
    });
    expect(value).toBe(0);
  });
});
