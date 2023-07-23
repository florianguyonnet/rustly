import { None, Option, Some } from './option';

const ERROR_RESULT_SHOULD_BE_OK = 'Result should be of type Ok';
const ERROR_RESULT_SHOULD_BE_ERR = 'Result should be of type Err';

interface ResultInterface<OkValue, ErrValue> {
  ok(): Option<OkValue>,
  err(): Option<ErrValue>,

  unwrap(): OkValue,
  // unwrapOr(def: OkValue): OkValue,
  // unwrapOrElse(fn: () => OkValue): OkValue,
  unwrapErr(): ErrValue,
  // unwrapErrOr(def: ErrValue): ErrValue,
  // unwrapErrOrElse(fn: () => any): any,

  // expect(msg: string): any,
  // expectErr(msg: string): Err,

  isOk(): boolean,
  isErr(): boolean,

  isOkAnd(fn: (res: OkValue) => boolean): boolean,
  isErrAnd(fn: (err: ErrValue) => boolean): boolean,

  map<NewValue>(fn: (res: OkValue) => NewValue): Result<NewValue, ErrValue>,
  mapErr<NewError>(fn: (err: ErrValue) => NewError): Result<OkValue, NewError>,
  mapOr<NewValue>(def: NewValue | (() => NewValue), fn: (res: OkValue) => NewValue): NewValue,

  or<OtherValue, OtherError>(res: Result<OtherValue, OtherError>): Result<OkValue, ErrValue> | Result<OtherValue, OtherError>,
  and<OtherValue, OtherError>(res: Result<OtherValue, OtherError>): Result<OtherValue, OtherError> | Result<OkValue, ErrValue>,

  // andThen<T>(fn: (res: any) => Result<T, Err>): Result<T, Err>,
  // orElse<T>(fn: (err: any) => Result<Ok, T>): Result<Ok, T>,
}

enum ResultType {
  OK = 'Ok',
  ERR = 'Err',
}

class Result<OkValue, ErrValue> implements ResultInterface<OkValue, ErrValue> {
  public static Type = ResultType;

  readonly value?: OkValue | ErrValue;

  private readonly type: ResultType;

  constructor(type: ResultType, value?: OkValue | ErrValue) {
    this.value = value;
    this.type = type;
  }

  ok(): Option<OkValue> {
    return this.isOk() ? Some(this.value as OkValue) : None();
  }

  err(): Option<ErrValue> {
    return this.isErr() ? Some(this.value as ErrValue) : None();
  }

  unwrap(): OkValue {
    if (this.isOk()) {
      return this.value as OkValue;
    }

    throw new Error(ERROR_RESULT_SHOULD_BE_OK);
  }

  unwrapErr(): ErrValue {
    if (this.isErr()) {
      return this.value as ErrValue;
    }

    throw new Error(ERROR_RESULT_SHOULD_BE_ERR);
  }

  isOk(): boolean {
    return this.type === ResultType.OK;
  }

  isErr(): boolean {
    return this.type === ResultType.ERR;
  }

  isOkAnd(fn: (res: OkValue) => boolean): boolean {
    if (this.isOk()) {
      return fn(this.value as OkValue);
    }

    return false;
  }

  isErrAnd(fn: (err: ErrValue) => boolean): boolean {
    if (this.isErr()) {
      return fn(this.value as ErrValue);
    }

    return false;
  }

  map<NewValue>(fn: (res: OkValue) => NewValue): Result<NewValue, ErrValue> {
    if (this.isOk()) {
      const newValue = fn(this.value as OkValue);
      return Ok(newValue);
    }

    return Err<ErrValue, NewValue>(this.value as ErrValue);
  }

  mapErr<NewValue>(fn: (err: ErrValue) => NewValue): Result<OkValue, NewValue> {
    if (this.isErr()) {
      const newValue = fn(this.value as ErrValue);
      return Err(newValue);
    }

    return Ok<OkValue, NewValue>(this.value as OkValue);
  }

  mapOr<NewValue>(def: NewValue | (() => NewValue), fn: (res: OkValue) => NewValue): NewValue {
    if (this.isOk()) {
      return fn(this.value as OkValue);
    }

    return def instanceof Function ? def() : def;
  }

  or<OtherValue, OtherError>(res: Result<OtherValue, OtherError>): Result<OkValue, ErrValue> | Result<OtherValue, OtherError> {
    return this.isOk() ? this : res;
  }

  and<OtherValue, OtherError>(res: Result<OtherValue, OtherError>): Result<OtherValue, OtherError> | Result<OkValue, ErrValue> {
    return this.isOk() ? res : this;
  }

  static merge<OkValue, ErrValue>(results: Result<OkValue, ErrValue>[]): Result<OkValue[], ErrValue> {
    return results.reduce((mergedResult, result) => {
      return result.mapOr(mergedResult, (value): Result<OkValue[], ErrValue> => {
        return mergedResult.map((values) => values.concat(value));
      });
    }, Ok<OkValue[], ErrValue>([]));
  }
}

function Ok<OkValue = undefined, ErrValue = undefined>(value?: OkValue): Result<OkValue, ErrValue> {
  return new Result<OkValue, ErrValue>(Result.Type.OK, value);
}

function Err<ErrValue = undefined, OkValue = undefined>(value?: ErrValue): Result<OkValue, ErrValue> {
  return new Result<OkValue, ErrValue>(Result.Type.ERR, value);
}

export { Err, Ok, Result };
