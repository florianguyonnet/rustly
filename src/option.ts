// eslint-disable-next-line import/no-cycle
import { Err, Ok, Result } from './result';

const ERROR_OPTION_SHOULD_BE_SOME = 'Option should be of type Some';

interface OptionInterface<Value> {
  isSome(): boolean
  isNone(): boolean
  isSomeAnd(fn: (value: Value) => boolean): boolean

  unwrap(): Value
  unwrapOr(def: Value | (() => Value)): Value

  expect(msg: string): Value

  insert(value: Value): Option<Value>
  replace(value: Value): Option<Value>
  take(): Option<Value>

  map<NewValue>(fn: (value: Value) => NewValue): Option<NewValue>
  mapOr<NewValue>(def: NewValue | (() => NewValue), fn: (value: Value) => NewValue): NewValue

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

  expect(msg: string): Value {
    return this.unwrapOr(() => {
      throw new Error(`${msg}`);
    });
  }

  insert(value: Value): Option<Value> {
    if (this.isNone()) {
      return Some(value);
    }

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

  mapOr<NewValue>(def: NewValue | (() => NewValue), fn: (value: Value) => NewValue): NewValue {
    if (this.isSome()) {
      return fn(this.value as Value);
    }

    return def instanceof Function ? def() : def;
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
}

function Some<Value>(value: Value): Option<Value> {
  return new Option(OptionType.SOME, value);
}

function None<Value>(): Option<Value> {
  return new Option(OptionType.NONE);
}

export { None, Option, Some };
