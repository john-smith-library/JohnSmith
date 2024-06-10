import { Listenable, ListenersAware } from '../listenable';
import { DependantListenableValue } from './support/dependant-listenable-value';

/**
 * Combines two source listenables into one transforming the source values on every change.
 * If you need to combine more than two source listenables please consider using
 * {@link reactive/transformers/combine-all!combineAll | `combineAll`} function instead.
 *
 * @example
 * [[include:reactive/transformers/combine.ts]]
 *
 * @param left first listenable to combine
 * @param right second listenable to combine
 * @param transform the function to combine values
 */
export const combine = <TLeft, TRight, TResult>(
  left: Listenable<TLeft>,
  right: Listenable<TRight>,
  transform: (left: TLeft, right: TRight) => TResult
): Listenable<TResult> & ListenersAware =>
  new DependantListenableValue([left, right], transform);
