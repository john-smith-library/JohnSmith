import { Disposable } from '../common';
import { ArrayUtils } from '../utils/array';

/**
 * Defines listenable data change reason.
 */
export enum DataChangeReason {
  /**
   * Data has been fully replaced with current portion.
   */
  replace,

  /**
   * Current portion is the initial value. Initial is something
   * set before the listeners attached.
   */
  initial,

  /**
   * Current portion has been added to the exiting value.
   * Used for arrays modification.
   */
  add,

  /**
   * Current portion has been removed from exiting value.
   * Used for arrays modification.
   */
  remove,
}

/**
 * Detailed information about listenable data change.
 */
export interface ChangeDetails<T> {
  reason: DataChangeReason;
  portion: T;
}

/**
 * Listenable callback signature.
 */
// export interface ListenerCallback<T> {
//     (value: T, oldValue: T|undefined, details: ChangeDetails<T>): void;
// }

class ListenerLink<T> implements Disposable {
  constructor(
    private allListeners: T[],
    private currentListener: T
  ) {}

  public dispose() {
    ArrayUtils.removeItem(this.allListeners, this.currentListener);
  }
}

/**
 * Listenable callback signature.
 */
export interface ListenerCallback<TItem> {
  (value: TItem): void;
}

/**
 * Partial listenable callback signature.
 *
 * @param portion the changed part of data
 * @param reason data change reason
 */
export interface PartialListenerCallback<TItem> {
  (portion: TItem, reason: DataChangeReason): void;
}

/**
 * Basic abstract interface for all the reactive classes.
 */
export abstract class Listenable<T> {
  /**
   * Attaches a listener to this listenable object. The listener
   * will be called for every change related to the listenable.
   *
   * @param listener the listener callback
   * @param raiseInitial a flag indicating whether the callback should be called
   * right away with the actual value. Default is `true`.
   */
  public abstract listen(
    listener: ListenerCallback<T>,
    raiseInitial?: boolean
  ): Disposable;
}

export interface PartialListenable<T> {
  /**
   * Attaches a listener to this listenable object. The listener
   * will be called for every change related to the listenable.
   *
   * @param listener the listener callback
   * @param raiseInitial a flag indicating whether the callback should be called
   * right away with the actual value. Default is `true`.
   */
  listenPartial(
    listener: PartialListenerCallback<T>,
    raiseInitial?: boolean
  ): Disposable;
}

/**
 * A helper class to encapsulate the logic of listener
 * callbacks management via composition. This class is for
 * internal framework usages.
 */
export class Listeners<T> {
  private _items: ListenerCallback<T>[] = [];

  public add(
    listener: ListenerCallback<T>,
    initial: T | undefined
  ): Disposable {
    this._items.push(listener);
    if (initial !== undefined) {
      listener(initial);
    }

    return new ListenerLink(this._items, listener);
  }

  public notify(newValue: T): void {
    for (let i = 0; i < this._items.length; i++) {
      this._items[i](newValue);
    }
  }

  public size() {
    return this._items.length;
  }
}

/**
 * A helper class to encapsulate the logic of listener
 * callbacks management via composition. This class is for
 * internal framework usages.
 */
export class PartialListeners<TItem> {
  private _items: PartialListenerCallback<TItem>[] = [];

  public add(
    listener: PartialListenerCallback<TItem>,
    initial?: TItem
  ): Disposable {
    this._items.push(listener);
    if (initial !== undefined) {
      listener(initial, DataChangeReason.initial);
    }

    return new ListenerLink(this._items, listener);
  }

  public notify(newValue: TItem, reason: DataChangeReason): void {
    for (let i = 0; i < this._items.length; i++) {
      this._items[i](newValue, reason);
    }
  }

  public size() {
    return this._items.length;
  }
}

export interface BidirectionalListenable<T> extends Listenable<T> {
  requestUpdate(newValue: T): void;
}

export abstract class ReadonlyObservable<T> extends Listenable<T> {
  public abstract getValue(): T;
}

export const isListenable = <T>(
  source: Listenable<T> | T
): source is Listenable<T> => {
  return !!(source as Listenable<T>).listen;
};

export const isPartialListenable = <T>(
  source: PartialListenable<T> | Listenable<T> | T
): source is PartialListenable<T> => {
  return !!(source as PartialListenable<T>).listenPartial;
};
