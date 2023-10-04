import {
  describe, expect, it, vi,
} from 'vitest';

import {
  Err, None, Ok, Some,
} from '../src';
import { isOptionInstance, isResultInstance } from '../src/utils';

describe('isResultInstance', () => {
  it('should be true when object is ok', () => {
    const result = Ok();
    expect(isResultInstance(result)).toBeTruthy();
  });

  it('should be true when object is err', () => {
    const result = Err();
    expect(isResultInstance(result)).toBeTruthy();
  });

  it('should be false when object is a result but with a different hash identifier', () => {
    const result = Ok();
    vi.spyOn(result, 'rustlyHashIdentifier', 'get').mockReturnValue('another_hash_identifier');
    expect(isResultInstance(result)).toBeFalsy();
  });

  it('should be false when object is not a result', () => {
    const anotherObject = { foo: 'bar' };
    expect(isResultInstance(anotherObject)).toBeFalsy();
  });

  it('should be false when object is undefined', () => {
    expect(isResultInstance(undefined)).toBeFalsy();
  });
});

describe('isOptionInstance', () => {
  it('should be true when object is some', () => {
    const result = Some();
    expect(isOptionInstance(result)).toBeTruthy();
  });

  it('should be true when object is none', () => {
    const result = None();
    expect(isOptionInstance(result)).toBeTruthy();
  });

  it('should be false when object is an option but with a different hash identifier', () => {
    const result = Some();
    vi.spyOn(result, 'rustlyHashIdentifier', 'get').mockReturnValue('another_hash_identifier');
    expect(isOptionInstance(result)).toBeFalsy();
  });

  it('should be false when object is not an option', () => {
    const anotherObject = { foo: 'bar' };
    expect(isOptionInstance(anotherObject)).toBeFalsy();
  });

  it('should be false when object is undefined', () => {
    expect(isOptionInstance(undefined)).toBeFalsy();
  });
});
