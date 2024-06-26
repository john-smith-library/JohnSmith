import { Listenable, ListenerCallback } from '../listenable';
import { Disposable } from '../../common';

/**
 * Creates new listenable that emits values applying the mapper function
 * to source listenable values.
 *
 * @example
 * [[include:reactive/transformers/map.ts]]
 *
 * @param listenable target listenable object
 * @param mapper mapping function
 */
export const map = <TValue, TResult>(
  listenable: Listenable<TValue>,
  mapper: (value: TValue) => TResult
): Listenable<TResult> => new MappedListenable(listenable, mapper);

class MappedListenable<TSource, TTarget> extends Listenable<TTarget> {
  constructor(
    private source: Listenable<TSource>,
    private mapper: (value: TSource) => TTarget
  ) {
    super();
  }

  public listen(
    listener: ListenerCallback<TTarget>,
    raiseInitial?: boolean
  ): Disposable {
    return this.source.listen(value => {
      const mappedNewValue: TTarget = this.mapper(value);
      listener(mappedNewValue);
    }, raiseInitial);
  }
}
