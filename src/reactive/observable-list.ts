import { ObservableValue } from './observable-value';
import {
  DataChangeReason,
  PartialListenable,
  PartialListenerCallback,
  PartialListeners,
} from './listenable';
import { ArrayUtils } from '../utils/array';
import { Disposable } from '../common';

/**
 * Defines a stateful listenable class for lists. Supports both regular and partial
 * notifications on list mutation.
 */
export class ObservableList<T>
  extends ObservableValue<T[]>
  implements PartialListenable<T[]>
{
  private _count: ObservableValue<number> | null = null;
  private _partialListeners: PartialListeners<T[]> = new PartialListeners<
    T[]
  >();

  constructor(value?: T[]) {
    super(value === undefined ? [] : value);
  }

  public listenPartial(
    listener: PartialListenerCallback<T[]>,
    raiseInitial?: boolean
  ): Disposable {
    return this._partialListeners.add(
      listener,
      raiseInitial === undefined || raiseInitial ? this.getValue() : undefined
    );
  }

  /**
   * Gets the number of listeners attached to the observable value.
   */
  public getPartialListenersCount(): number {
    return this._partialListeners.size();
  }

  public setValue(value: T[]) {
    if (value) {
      if (!(value instanceof Array)) {
        throw new Error('Observable list supports only array values');
      }
    }

    super.setValue(value);
    this._partialListeners.notify(value, DataChangeReason.replace);
    this.notifyCountListeners();
  }

  public add(...args: T[]): void {
    const currentValue = this.getValue();
    for (let i = 0; i < args.length; i++) {
      currentValue.push(args[i]);
    }

    this.reactOnChange(args, DataChangeReason.add);
  }

  public remove(...args: T[]): void {
    const currentValue = this.getValue();

    for (let i = 0; i < args.length; i++) {
      ArrayUtils.removeItem(currentValue, args[i]);
    }

    this.reactOnChange(args, DataChangeReason.remove);
  }

  /** Removes all items from the list */
  public clear(): void {
    const currentValue = this.getValue();
    if (currentValue !== null) {
      const removed = currentValue.splice(0, currentValue.length);
      this.reactOnChange(removed, DataChangeReason.remove);
    }
  }

  /** Returns a bindable value that stores size of the list */
  public count(): ObservableValue<number> {
    if (this._count === null) {
      this._count = new ObservableValue<number>(0);
      this.notifyCountListeners();
    }

    return this._count;
  }

  public currentCount() {
    return this.getValue().length;
  }

  public getRequiredLast() {
    const value = this.getRequiredValue();
    if (value.length === 0) {
      throw new Error('Expected non empty list');
    }

    return value[value.length - 1];
  }

  public forEach(callback: (item: T) => void, thisArg?: unknown) {
    const array: T[] = this.getValue() || [];
    array.forEach(callback, thisArg);
  }

  private reactOnChange(portion: T[], reason: DataChangeReason): void {
    this._listeners.notify(this.getValue());
    this._partialListeners.notify(portion, reason);

    this.notifyCountListeners();
  }

  private notifyCountListeners(): void {
    if (this._count !== null) {
      this._count.setValue(this.currentCount());
    }
  }
}
