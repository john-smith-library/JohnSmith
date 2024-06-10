import { Disposable } from '../../common';
import { Listenable, ListenerCallback } from '../listenable';

/**
 * Enhances a Listenable input to also provide the previous value. If previous values
 * has not been captured yet, the corresponding `previous` field will be `undefined`.
 *
 * @example
 * [[include:reactive/transformers/with-previous.ts]]
 *
 * @param input - The Listenable input to enhance.
 * @returns A new Listenable that provides both current and previous values.
 */
export const withPrevious = <T>(
  input: Listenable<T>
): Listenable<{ current: T; previous: T | undefined }> => {
  return {
    listen(
      listener: ListenerCallback<{ current: T; previous: T | undefined }>,
      raiseInitial?: boolean
    ): Disposable {
      let previous: T | undefined = undefined;

      return input.listen(value => {
        const actualPrevious = previous;
        previous = value;
        listener({ current: value, previous: actualPrevious });
      }, raiseInitial);
    },
  };
};
