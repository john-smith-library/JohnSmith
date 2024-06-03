import {
  ListenerCallback,
  Listeners,
  ListenersAware,
  ReadonlyObservable,
} from './listenable';
import { Disposable } from '../common';

/**
 * Defines a stateful listenable class.
 */
export class ObservableValue<T>
  extends ReadonlyObservable<T>
  implements ListenersAware
{
  protected _listeners = new Listeners<T>();
  private _value: T;

  /**
   * Creates new observable value instance.
   * @param value initial value
   */
  constructor(value: T) {
    super();
    this._value = value;
  }

  /**
   * Gets current value, can return `null`.
   */
  public getValue(): T {
    return this._value;
  }

  /**
   * Gets current value or throws an error if it's `null`.
   */
  public getRequiredValue(): T {
    if (this._value === null) {
      throw new Error('Expected a value but was null');
    }

    return this._value;
  }

  /**
   * Sets current value or resets it to null and notifies all the listeners
   * about the change details.
   *
   * @param value
   */
  public setValue(value: T) {
    this._value = value;
    this._listeners.notify(value);
  }

  /**
   * Returns true if current value is not null.
   */
  public hasValue(): boolean {
    return !(this._value == null);
  }

  /**
   * Gets the number of listeners attached to the observable value.
   */
  public getListenersCount(): number {
    return this._listeners.size();
  }

  /**
   * Mutates the current value using the provided action and sets the new value.
   *
   * This method is a shortcut for setting values basing on current value. For example
   * @example
   * var observable = new ObservableValue<number>(1);
   * // the mutation:
   * observable.setValue(observable.getValue() + 1);
   * // ...can be shorten to
   * observable.mutate(x => x + 1);
   * @param action A function that takes the current value and returns the new value.
   */
  public mutate(action: (currentValue: T) => T) {
    const nextValue = action(this._value);
    this.setValue(nextValue);
  }

  /**
   * Attaches a listener to this observable value object. The listener
   * will be called for every setValue call.
   *
   * @param listener the listener callback
   * @param raiseInitial a flag indicating whether the callback should be called
   * right away with the actual value. Default is `true`.
   */
  public listen(
    listener: ListenerCallback<T>,
    raiseInitial?: boolean
  ): Disposable {
    const actualRaiseInitial = raiseInitial === undefined || raiseInitial;

    return actualRaiseInitial
      ? this._listeners.add(listener, this.getValue(), true)
      : this._listeners.add(listener, undefined, false);
  }
}
