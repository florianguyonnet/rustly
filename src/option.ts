import { Err, Ok, Result } from './result';
import { OPTION_TYPE_RUSTLY_HASH_IDENTIFIER } from './utils';

const ERROR_OPTION_SHOULD_BE_SOME = 'Option should be of type Some';
const ERROR_OPTION_SHOULD_BE_NONE = 'Option should be of type None';

export interface OptionMatchInterface<Value, NoneResult, SomeResult> {
  none(): NoneResult,
  some(data: Value): SomeResult
}

interface OptionInterface<Value> {
  isSome(): boolean
  isNone(): boolean
  isSomeAnd(fn: (value: Value) => boolean): boolean
  isNoneAnd(fn: () => boolean): boolean

  unwrap(): Value
  unwrapOr(def: Value | (() => Value)): Value
  unwrapNone(): void

  expect(msg: string): Value

  match<NoneResult, SomeResult>(cases: OptionMatchInterface<Value, NoneResult, SomeResult>): void

  insert(value: Value): Option<Value>
  replace(value: Value): Option<Value>
  take(): Option<Value>

  map<NewValue>(fn: (value: Value) => NewValue): Option<NewValue>
  mapOr<NewValue>(def: NewValue | (() => NewValue), fn: (value: Value) => NewValue): Option<NewValue>

  okOr<ErrValue>(def: ErrValue | (() => ErrValue)): Result<Value, ErrValue>

  or<OtherValue>(other: Option<OtherValue>): Option<Value> | Option<OtherValue>
  and<OtherValue>(other: Option<OtherValue>): Option<OtherValue> | Option<Value>
}

enum OptionType {
  SOME = 'Some',
  NONE = 'None',
}

class Option<Value> implements OptionInterface<Value> {
  public static Type = OptionType;

  protected value?: Value;

  protected type: OptionType;

  constructor(type: OptionType, value?: Value) {
    this.value = value;
    this.type = type;
  }

  isSome(): boolean {
    return this.type === OptionType.SOME;
  }

  isNone(): boolean {
    return this.type === OptionType.NONE;
  }

  isSomeAnd(fn: (value: Value) => boolean): boolean {
    if (this.isSome()) {
      return fn(this.value as Value);
    }

    return false;
  }

  isNoneAnd(fn: () => boolean): boolean {
    if (this.isNone()) {
      return fn();
    }

    return false;
  }

  unwrap(): Value {
    if (this.isSome()) {
      return this.value as Value;
    }

    throw new Error(ERROR_OPTION_SHOULD_BE_SOME);
  }

  unwrapOr(def: Value | (() => Value)): Value {
    if (this.isSome()) {
      return this.value as Value;
    }

    return def instanceof Function ? def() : def;
  }

  unwrapNone(): void {
    if (this.isSome()) {
      throw new Error(ERROR_OPTION_SHOULD_BE_NONE);
    }
  }

  expect(msg: string): Value {
    return this.unwrapOr(() => {
      throw new Error(`${msg}`);
    });
  }

  match<NoneResult, SomeResult>(cases: OptionMatchInterface<Value, NoneResult, SomeResult>): NoneResult | SomeResult {
    if (this.isNone()) {
      return cases.none();
    }
    return cases.some(this.value as Value);
  }

  insert(value: Value): Option<Value> {
    this.value = value;
    this.type = OptionType.SOME;
    return this;
  }

  take(): Option<Value> {
    if (this.isSome()) {
      const value = this.value as Value;

      this.type = OptionType.NONE;
      this.value = undefined;

      return Some(value);
    }

    return None();
  }

  replace(value: Value): Option<Value> {
    const oldOption = this.take();
    this.value = value;
    this.type = OptionType.SOME;
    return oldOption;
  }

  map<NewValue>(fn: (value: Value) => NewValue): Option<NewValue> {
    if (this.isSome()) {
      return Some(fn(this.value as Value));
    }

    return None();
  }

  mapOr<NewValue>(def: NewValue | (() => NewValue), fn: (value: Value) => NewValue): Option<NewValue> {
    if (this.isSome()) {
      return Some(fn(this.value as Value));
    }

    const result = def instanceof Function ? def() : def;
    return Some(result);
  }

  okOr<ErrValue>(def: ErrValue | (() => ErrValue)): Result<Value, ErrValue> {
    if (this.isSome()) {
      return Ok(this.value as Value);
    }

    return Err(def instanceof Function ? def() : def);
  }

  or<OtherValue>(other: Option<OtherValue>): Option<Value> | Option<OtherValue> {
    return this.isSome() ? this : other;
  }

  and<OtherValue>(other: Option<OtherValue>): Option<OtherValue> | Option<Value> {
    return this.isSome() ? other : this;
  }

  get rustlyHashIdentifier(): string {
    return OPTION_TYPE_RUSTLY_HASH_IDENTIFIER;
  }
}

function Some<Value>(value?: Value): Option<Value> {
  return new Option(OptionType.SOME, value);
}

function None<Value>(): Option<Value> {
  return new Option(OptionType.NONE);
}

export { None, Option, Some };
