import {
  Listenable,
  ListenerCallback,
  Listeners,
  ListenersAware,
} from './listenable';
import { Disposable } from '../common';

/**
 * Events are stateless reactive actors that notify it`s listeners on data trigger.
 *
 * *Stateless* in terms of Events means they never store current value and do not
 * have methods like `getValue`, `setValue` etc.
 *
 * Use [[trigger]] method to initiate listener notification.
 */
export class Event<T> extends Listenable<T> implements ListenersAware {
  private _listeners = new Listeners<T>();

  /**
   * Returns the number of listeners attached to the event.
   */
  public getListenersCount(): number {
    return this._listeners.size();
  }

  /**
   * Attaches a listener to this event. The listener
   * will be called for every change related to the listenable.
   *
   * Please note that `raiseInitial` argument of `Listenable` contract
   * gets ignored by Events as Events never store any state.
   *
   * @param listener the listener callback
   */
  public listen(listener: ListenerCallback<T>): Disposable {
    return this._listeners.add(listener, undefined);
  }

  /**
   * Triggers the event and notifies all the listeners.
   * @param data data object to pass to the listeners
   */
  public trigger(data: T) {
    this._listeners.notify(data);
  }
}
