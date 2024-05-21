import { AsterError } from './AsterError';

export class MwApiWrapper<T> implements PromiseLike<T> {
  private readonly jQueryPromise: JQuery.Promise<T>;

  private constructor(jQueryPromise: JQuery.Promise<T>) {
    this.jQueryPromise = jQueryPromise;
  }

  public static of<J>(jQueryPromise: JQuery.Promise<J>): MwApiWrapper<J> {
    return new MwApiWrapper(jQueryPromise);
  }

  public then<TResult1 = T, TResult2 = never>(
    onFulfilled?: (value: T) => PromiseLike<TResult1> | TResult1,
    onRejected?: (reason: AsterError) => TResult2 | PromiseLike<TResult2>
  ): Promise<TResult1 | TResult2> {
    return new Promise<TResult1 | TResult2>((resolve, reject) =>
      this.jQueryPromise.then(
        (response) => {
          if (response && typeof response === 'object' && response.hasOwnProperty('warnings')) {
            reject(new AsterError('warnings', JSON.stringify(response)));
          }

          if (onFulfilled) {
            try {
              resolve(onFulfilled(response));
            } catch (e) {
              reject(new AsterError('ambiguous', String(e)));
            }
          } else {
            resolve(response as TResult1 | TResult2);
          }
        },
        (code: string, response: unknown) => {
          const error = new AsterError(
            code,
            ['http', 'ok-but-empty'].includes(code) ? null : JSON.stringify(response)
          );

          if (onRejected) {
            reject(onRejected(error));
          } else {
            reject(error);
          }
        }
      )
    );
  }
}
