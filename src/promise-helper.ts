import { Err, Ok, Result } from './result';
import { isResultInstance } from './utils';

declare global {
  interface Promise<T> {
    thenOnOk<U>(callback: (value: T extends Result<infer OkValue, any> ? OkValue : never) => U | PromiseLike<U>): Promise<U>;
    thenOnErr<U>(callback: (error: T extends Result<any, infer ErrValue> ? ErrValue : any) => U | PromiseLike<U>): Promise<U>;
  }

  interface PromiseConstructor {
    resolveFromOk<T>(value: T): Promise<Result<T, any>>;
    resolveFromErr<T>(error: T): Promise<Result<any, T>>;
  }
}

// eslint-disable-next-line no-extend-native
Promise.prototype.thenOnOk = function <T, U>(
  this: Promise<Result<T, any>>,
  callback: (value: T) => any,
): Promise<U> {
  return this.then((ok) => {
    if (isResultInstance(ok) && ok.isOk()) {
      return callback(ok.unwrap()) as any;
    }
    return ok as any;
  });
};

// eslint-disable-next-line no-extend-native
Promise.prototype.thenOnErr = function <T, U>(
  this: Promise<Result<any, T>>,
  callback: (value: T) => any,
): Promise<U> {
  return this.then((err) => {
    if (isResultInstance(err) && err.isErr()) {
      return callback(err.unwrapErr()) as any;
    }
    return err as any;
  });
};

Promise.resolveFromOk = function <T>(value: T): Promise<Result<T, any>> {
  return Promise.resolve(Ok(value));
};

Promise.resolveFromErr = function <T>(error: T): Promise<Result<any, T>> {
  return Promise.resolve(Err(error));
};
