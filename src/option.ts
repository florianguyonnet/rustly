const ERROR_OPTION_SHOULD_BE_SOME = 'Option should be of type Some';
// const ERROR_OPTION_SHOULD_BE_NONE = 'Option should be of type None';

interface OptionInterface<Value> {
  isSome(): boolean
  isNone(): boolean

  unwrap(): Value
}

enum OptionType {
  SOME = 'Some',
  NONE = 'None',
}

class Option<Value> implements OptionInterface<Value> {
  public static Type = OptionType;

  readonly value?: Value;

  private readonly type: OptionType;

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

  unwrap(): Value {
    if (this.isSome()) {
      return this.value as Value;
    }

    throw new Error(ERROR_OPTION_SHOULD_BE_SOME);
  }
}

function Some<Value>(value: Value): Option<Value> {
  return new Option(OptionType.SOME, value);
}

function None<Value>(): Option<Value> {
  return new Option(OptionType.NONE);
}

export { None, Option, Some };
