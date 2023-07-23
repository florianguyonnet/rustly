<h1 align="center">Rustly</h1>
<h3 align="center">Option( 🦀 ) & Result( <img height="17" src="https://emojis.slackmojis.com/emojis/images/1643514173/1383/typescript.png?1643514173" /> ) : Rust-like Implementation for TypeScript</h3>

<p align="center">
    <a href="">
      <img alt="MIT Licensed" src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat" />
    </a>
    <a href="https://www.npmjs.com/package/rustly">
      <img alt="NPM Status" src="https://img.shields.io/npm/v/rustly.svg?style=flat" />
    </a>
    <a href="https://github.com/florianguyonnet/rustly/actions?query=branch%3Amain">
      <img alt="CI Status" src="https://github.com/florianguyonnet/rustly/actions/workflows/ci-tests.yml/badge.svg?branch=main" />
    </a>
</p>


## Introduction

`rustly` is a TypeScript library that brings the power of Rust's `Option` and `Result` types to the TypeScript ecosystem. This package provides robust error handling and nullable value representation, allowing you to write more reliable and expressive code. The `Option` type deals with nullable values, while the `Result` type handles potential errors.

## Features

- Rust-like `Option` and `Result` types for TypeScript
- Safe and expressive error handling
- Familiar Rust-inspired API
- Easily manage nullable values and errors in a type-safe manner

## Installation

You can install `rustly` using npm:

```bash
npm install --save rustly
```

## Usage

### Result Usage

```typescript
import { Ok, Err, Result } from 'rustly';

const success = Ok(1);
const failure = Err('not a number');

success.ok(); // Option(1)
success.isOk(); // true
success.isOkAnd(val => val === 1); // true

success.err(); // None
success.isErr(); // false
success.isErrAnd(val => val === 1); // false

success.unwrap(); // 1
success.unwrapOr('not a number'); // 1
sucess.unwrapErr(); // throws
success.unwrapErrOr(42); // 42

success.expect('not a number'); // 1
success.expectErr('not a number'); // throws

success.map(val => val + 1); // Ok(2)
success.mapErr(val => val + 1); // Ok(1)

success.and(Ok(2)); // Ok(2)
success.and(Err('not a number')); // Err('not a number')

const arrayOfResult = [Ok(1), Ok(2), Ok(3)], Err('not a number')];
Result.merge(arrayOfResult); // Ok([1, 2, 3])
Result.mergeErr(arrayOfResult); // Err(['not a number'])
```

#### Option usage

```typescript
import { Some, None, Option } from 'rustly';

const some = Some(1);
const none = None();

some.isSome(); // true
some.isSomeAnd(val => val === 1); // true

some.isNone(); // false
some.isNoneAnd(val => val === 1); // false

some.unwrap(); // 1
some.unwrapOr('not a number'); // 1

some.expect('not a number'); // 1

none.insert(5); // Some(5)
const taken = some.take(); // Some(1) and some is now None
some.replace(2); // Some(2)

some.map(val => val + 1); // Some(2)
some.mapOr(42, val => val + 1); // Some(2)
none.mapOr(42, val => val + 1); // 42

some.okOr('not a number'); // Ok(1)
none.okOr('not a number'); // Err('not a number')

some.or(Some(2)); // Some(1)
none.or(Some(2)); // Some(2)

some.and(Some(2)); // Some(2)
none.and(Some(2)); // None
```
## Contributing

Contributions are welcome! If you find any issues or have new features to add, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE]() file for details.
