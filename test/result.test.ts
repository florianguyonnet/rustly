import { describe, expect, it } from 'vitest';

import { Err, Ok, Result } from '../src/result';

const ERROR_RESULT_SHOULD_BE_OK = 'Result should be of type Ok';
const ERROR_RESULT_SHOULD_BE_ERR = 'Result should be of type Err';

describe('result', () => {
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
      const isOk = result.isOkAnd((res) => true);
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
      const isErr = result.isErrAnd((res) => true);
      expect(isErr).toBeFalsy();
    });
  });

  describe('map', () => {
    it('should return the new value when result is a Ok ', () => {
      const expectedValue = 'it\'s ok';

      const result = Ok();
      const newResult = result.map((res) => expectedValue);
      expect(newResult.unwrap()).toEqual(expectedValue);
    });

    it('should return the same value when result is a Err ', () => {
      const expectedValue = 'it\'s err';

      const result = Err(expectedValue);
      const newResult = result.map((res) => 'it\'s not err');

      expect(newResult.unwrapErr()).toEqual(expectedValue);
    });
  });

  describe('mapErr', () => {
    it('should return the new value when result is a Err ', () => {
      const expectedValue = 'it\'s err';

      const result = Err();
      const newResult = result.mapErr((res) => expectedValue);
      expect(newResult.unwrapErr()).toEqual(expectedValue);
    });

    it('should return the same value when result is a Ok ', () => {
      const expectedValue = 'it\'s ok';

      const result = Ok(expectedValue);
      const newResult = result.mapErr((res) => 'it\'s err');

      expect(newResult.unwrap()).toEqual(expectedValue);
    });
  });

  describe('mapOr', () => {
    it('should return the value when result is a Ok ', () => {
      const expectedValue = 'it\'s ok';

      const result = Ok(expectedValue);
      const newValue = result.mapOr('on error value', (res) => res);
      expect(newValue).toEqual(expectedValue);
    });

    it('should return the default value when result is a Err ', () => {
      const expectedValue = 'it\'s err';

      const result = Err();
      const newValue = result.mapOr(expectedValue, () => 'it\'s not err');
      expect(newValue).toEqual(expectedValue);
    });
  });

  describe('mapErrOr', () => {
    it('should return the value when result is a Err ', () => {
      const expectedValue = 'it\'s ok';

      const result = Err(expectedValue);
      const newValue = result.mapErrOr('on ok value', (res) => res);
      expect(newValue).toEqual(expectedValue);
    });

    it('should return the default value when result is a Ok ', () => {
      const expectedValue = 'it\'s err';

      const result = Ok();
      const newValue = result.mapErrOr(expectedValue, () => 'it\'s not err');
      expect(newValue).toEqual(expectedValue);
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
    console.log(result.unwrapErr());
    expect(result.unwrapErr()).toBeUndefined();
  });
});
