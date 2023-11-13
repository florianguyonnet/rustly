import { describe, expect, it } from 'vitest';

import { Err, Ok, Result } from '../src';
import { RESULT_TYPE_RUSTLY_HASH_IDENTIFIER } from '../src/utils';

const ERROR_RESULT_SHOULD_BE_OK = 'Result should be of type Ok';
const ERROR_RESULT_SHOULD_BE_ERR = 'Result should be of type Err';

describe('result', () => {
  describe('ok', () => {
    it('should return a Some when result is Ok', () => {
      const result = Ok(true);
      expect(result.ok().isSome()).toBeTruthy();
    });

    it('should return a None when result is Err', () => {
      const result = Err();
      expect(result.ok().isNone()).toBeTruthy();
    });
  });

  describe('err', () => {
    it('should return a Some when result is Err', () => {
      const result = Err(true);
      expect(result.err().isSome()).toBeTruthy();
    });

    it('should return a None when result is Ok', () => {
      const result = Ok();
      expect(result.err().isNone()).toBeTruthy();
    });
  });

  describe('unwrap', () => {
    it('should return the value when result is Ok', () => {
      const result = Ok(true);
      expect(result.unwrap()).toBeTruthy();
    });

    it('should throw an error when result is Err', () => {
      const result = Err();
      expect(() => result.unwrap()).toThrowError(ERROR_RESULT_SHOULD_BE_OK);
    });
  });

  describe('unwrapOr', () => {
    it('should return the value when result is Ok', () => {
      const result = Ok(true);
      expect(result.unwrapOr(false)).toBeTruthy();
    });

    it('should return the default value when result is Err', () => {
      const result = Err<undefined, boolean>();
      expect(result.unwrapOr(false)).toBeFalsy();
    });

    it('should return the default value function result when result is Err', () => {
      const result = Err<undefined, boolean>();
      expect(result.unwrapOr(() => false)).toBeFalsy();
    });
  });

  describe('unwrapErr', () => {
    it('should return the value when result is Err', () => {
      const result = Err(true);
      expect(result.unwrapErr()).toBeTruthy();
    });

    it('should throw an error when result is Ok', () => {
      const result = Ok();
      expect(() => result.unwrapErr()).toThrowError(ERROR_RESULT_SHOULD_BE_ERR);
    });
  });

  describe('unwrapErrOr', () => {
    it('should return the value when result is Err', () => {
      const result = Err(true);
      expect(result.unwrapErrOr(false)).toBeTruthy();
    });

    it('should return the default value when result is Ok', () => {
      const result = Ok<undefined, boolean>();
      expect(result.unwrapErrOr(false)).toBeFalsy();
    });

    it('should return the default value function result when result is Ok', () => {
      const result = Ok<undefined, boolean>();
      expect(result.unwrapErrOr(() => false)).toBeFalsy();
    });
  });

  describe('expect', () => {
    it('should return the value when result is Ok', () => {
      const result = Ok(true);
      expect(result.expect('error message')).toBeTruthy();
    });

    it('should throw an error with the message when result is Err', () => {
      const result = Err();
      expect(() => result.expect('error message')).toThrowError('error message: undefined');
    });

    it('should throw an error with the message and the value when result is Err', () => {
      const result = Err('an error');
      expect(() => result.expect('error message')).toThrowError('error message: an error');
    });
  });

  describe('expectErr', () => {
    it('should return the value when result is Err', () => {
      const result = Err(true);
      expect(result.expectErr('error message')).toBeTruthy();
    });

    it('should throw an error with the message when result is Ok', () => {
      const result = Ok();
      expect(() => result.expectErr('error message')).toThrowError('error message: undefined');
    });

    it('should throw an error with the message and the value when result is Ok', () => {
      const result = Ok('a value');
      expect(() => result.expectErr('error message')).toThrowError('error message: a value');
    });
  });

  describe('isOk', () => {
    it('should be true when result is a Ok', () => {
      const result = Ok();
      expect(result.isOk()).toBeTruthy();
    });

    it('should be false when result is a Err', () => {
      const result = Err();
      expect(result.isOk()).toBeFalsy();
    });
  });

  describe('isErr', () => {
    it('should be true when result is a Err', () => {
      const result = Err();
      expect(result.isErr()).toBeTruthy();
    });

    it('should be false when result is a Ok', () => {
      const result = Ok();
      expect(result.isErr()).toBeFalsy();
    });
  });

  describe('isOkAnd', () => {
    it('should return true when result is a Ok and the function returns true', () => {
      const result = Ok('cat');
      const isOk = result.isOkAnd((res) => res === 'cat');
      expect(isOk).toBeTruthy();
    });

    it('should return false when result is a Ok and the function returns false', () => {
      const result = Ok('dog');
      const isOk = result.isOkAnd((res) => res === 'cat');
      expect(isOk).toBeFalsy();
    });

    it('should return false when result is a Err', () => {
      const result = Err();
      const isOk = result.isOkAnd(() => true);
      expect(isOk).toBeFalsy();
    });
  });

  describe('isErrAnd', () => {
    it('should return true when result is a Err and the function returns true', () => {
      const result = Err('cat');
      const isErr = result.isErrAnd((res) => res === 'cat');
      expect(isErr).toBeTruthy();
    });

    it('should return false when result is a Err and the function returns false', () => {
      const result = Err('dog');
      const isErr = result.isErrAnd((res) => res === 'cat');
      expect(isErr).toBeFalsy();
    });

    it('should return false when result is a Ok', () => {
      const result = Ok();
      const isErr = result.isErrAnd(() => true);
      expect(isErr).toBeFalsy();
    });
  });

  describe('map', () => {
    it('should return the new value when result is a Ok ', () => {
      const expectedValue = 'it\'s ok';

      const result = Ok();
      const newResult = result.map(() => expectedValue);
      expect(newResult.unwrap()).toEqual(expectedValue);
    });

    it('should return the same value when result is a Err ', () => {
      const expectedValue = 'it\'s err';

      const result = Err(expectedValue);
      const newResult = result.map(() => 'it\'s not err');

      expect(newResult.unwrapErr()).toEqual(expectedValue);
    });
  });

  describe('mapErr', () => {
    it('should return the new value when result is a Err ', () => {
      const expectedValue = 'it\'s err';

      const result = Err();
      const newResult = result.mapErr(() => expectedValue);
      expect(newResult.unwrapErr()).toEqual(expectedValue);
    });

    it('should return the same value when result is a Ok ', () => {
      const expectedValue = 'it\'s ok';

      const result = Ok(expectedValue);
      const newResult = result.mapErr(() => 'it\'s err');

      expect(newResult.unwrap()).toEqual(expectedValue);
    });
  });

  describe('mapOr', () => {
    it('should return the value when result is a Ok ', () => {
      const expectedValue = 'it\'s ok';

      const result = Ok(expectedValue);
      const newValue = result.mapOr('on error value', (res) => res);
      expect(newValue.unwrap()).toEqual(expectedValue);
    });

    it('should return the default value when result is a Err ', () => {
      const expectedValue = 'it\'s err';

      const result = Err();
      const newValue = result.mapOr(expectedValue, () => 'it\'s not err');
      expect(newValue.unwrap()).toEqual(expectedValue);
    });
  });

  describe('mapErrOr', () => {
    it('should return the value when result is a Err ', () => {
      const expectedValue = 'it\'s ok';

      const result = Err(expectedValue);
      const newValue = result.mapErrOr('on ok value', (res) => res);
      expect(newValue.unwrapErr()).toEqual(expectedValue);
    });

    it('should return the default value when result is a Ok ', () => {
      const expectedValue = 'it\'s err';

      const result = Ok();
      const newValue = result.mapErrOr(expectedValue, () => 'it\'s not err');
      expect(newValue.unwrapErr()).toEqual(expectedValue);
    });
  });

  describe('or', () => {
    it('should return the first value when both are Ok ', () => {
      const firstOk = Ok('first ok');
      const secondOk = Ok('second ok');

      expect(firstOk.or(secondOk).unwrap()).toEqual('first ok');
    });

    it('should return the first value when it the second one is Err ', () => {
      const firstOk = Ok('first ok');
      const secondErr = Err('second err');

      expect(firstOk.or(secondErr).unwrap()).toEqual('first ok');
    });

    it('should return the second value when the first one Err ', () => {
      const firstErr = Err('first err');
      const secondOk = Ok('second ok');

      expect(firstErr.or(secondOk).unwrap()).toEqual('second ok');
    });

    it('should return the second error value when both are Err ', () => {
      const firstErr = Err('first err');
      const secondErr = Err('second err');

      expect(firstErr.or(secondErr).unwrapErr()).toEqual('second err');
    });
  });

  describe('and', () => {
    it('should return the second value when both are Ok ', () => {
      const firstOk = Ok('first ok');
      const secondOk = Ok('second ok');

      expect(firstOk.and(secondOk).unwrap()).toEqual('second ok');
    });

    it('should return the first error value when the first one is Err ', () => {
      const firstErr = Err('first err');
      const secondOk = Ok('second ok');

      expect(firstErr.and(secondOk).unwrapErr()).toEqual('first err');
    });

    it('should return the second error value when the second one is Err ', () => {
      const firstOk = Ok('first ok');
      const secondErr = Err('second err');

      expect(firstOk.and(secondErr).unwrapErr()).toEqual('second err');
    });

    it('should return the first error value when both are Err ', () => {
      const firstErr = Err('first err');
      const secondErr = Err('second err');

      expect(firstErr.and(secondErr).unwrapErr()).toEqual('first err');
    });
  });

  describe('flatten', () => {
    it('should return the last result when multiple results are nested', () => {
      const expectedValue = 'it\'s err';
      const nestedResults = Ok(Ok(Err(Ok(Err(expectedValue)))));

      const result = nestedResults.flatten();
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toEqual(expectedValue);
    });

    it('should return the last result when no results are nested', () => {
      const expectedValue = 'it\'s ok';
      const nestedResults = Ok(expectedValue);

      const result = nestedResults.flatten();
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toEqual(expectedValue);
    });
  });

  describe('[get] rustlyHashIdentifier', () => {
    it('should return the rustly hash identifier', () => {
      const result = Ok();
      expect(result.rustlyHashIdentifier).toEqual(RESULT_TYPE_RUSTLY_HASH_IDENTIFIER);
    });
  });

  describe('[static] merge', () => {
    it('should return a Ok with an array of values with all results which are Ok', () => {
      const listOfResultsToMerge = [
        Err(1),
        Ok(1),
        Ok(2),
        Err(2),
        Ok(3),
        Err(3),
      ];

      const mergedResult = Result.merge(listOfResultsToMerge);
      const expectedResult = Ok([1, 2, 3]);

      expect(mergedResult).toEqual(expectedResult);
    });
  });

  describe('[static] mergeErr', () => {
    it('should return a Err with an array of values with all results which are Err', () => {
      const listOfResultsToMerge = [
        Ok(1),
        Err(1),
        Err(2),
        Ok(2),
        Err(3),
        Ok(3),
      ];

      const mergedResult = Result.mergeErr(listOfResultsToMerge);
      const expectedResult = Err([1, 2, 3]);

      expect(mergedResult).toEqual(expectedResult);
    });
  });
});

describe('Ok', () => {
  it('should return a Ok result with a boolean value', () => {
    const result = Ok(true);
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeTruthy();
  });

  it('should return a Ok result with a None value', () => {
    const result = Ok();
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeUndefined();
  });
});

describe('Err', () => {
  it('should return a Err result with a boolean value', () => {
    const result = Err(true);
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeTruthy();
  });

  it('should return a Err result with a None value', () => {
    const result = Err();
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeUndefined();
  });
});

describe('match', () => {
  it('should match an Ok with the "ok" case', () => {
    const result = Ok("Some text");
    let success!: boolean;
    result.match({
      ok() {
        success = true
      },
      err() {
        success = false;
      }
    });
    expect(success).toBeTruthy();
  });

  it('should match an Err with the "err" case', () => {
    const result = Err("Some text");
    let success!: boolean;
    result.match({
      ok() {
        success = true
      },
      err() {
        success = false;
      }
    });
    expect(success).toBeFalsy();
  });

  it('should give a value for the "ok" case', () => {
    const result = Ok(2);
    result.match({
      ok(data) {
        expect(data).toBe(2);
      },
      err() {},
    })
  });

  it('should give a value for the "err" case', () => {
    const result = Err("Fail text");
    result.match({
      ok() {},
      err(data) {
        expect(data).toBe("Fail text");
      },
    })
  });

  it('should allow for values to be returned by "ok" case', () => {
    const result = Ok(4);
    let value = result.match({
      ok(data) {
        return data + 1;
      },
      err() {
        return 0;
      },
    });
    expect(value).toBe(5);
  });

  it('should allow for values to be returned by "err" case', () => {
    const result: Result<number, string> = Err<string, number>("Failed");
    let value = result.match({
      ok(data) {
        return data + 1;
      },
      err() {
        return 0;
      },
    });
    expect(value).toBe(0);
  });
});