### Option & Result object rust like implementation for typescript

#### Result usage

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
success.unwrapOr('not a number') // 1
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
some.unwrapOr('not a number') // 1

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