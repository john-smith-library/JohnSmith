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
   * @param value optional initial value
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
    const initial =
      raiseInitial === undefined || raiseInitial ? this.getValue() : undefined;
    return this._listeners.add(listener, initial);
  }
}
