import { Listenable } from '../listenable';
import { ListenerArray } from './support/listener-array';
import { DependantListenableValue } from './support/dependant-listenable-value';

/**
 * Combines multiple source listenables into one, grouping their values into an array.
 *
 * @example
 * [[include:reactive/transformers/combine-all.ts]]
 *
 * @param input an array of listenables to combine
 * @returns a new listenable that provides an array of the values of the input listenables
 */
export const combineAll = <T extends unknown[]>(
  input: ListenerArray<T>
): Listenable<T> => {
  return new DependantListenableValue<T, T>(input, (...x) => x);
};
