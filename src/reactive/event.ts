/**
 * @module reactive
 */

import {DataChangeReason, Listenable, ListenerCallback, Listeners} from './listenable';
import {Disposable} from '../common';

/**
 * Events are stateless listenables that only notify on incoming data change.
 */
export class Event<T> extends Listenable<T> {
    private _listeners = new Listeners<T>();

    /**
     * Returns the number of listeners attached to the event.
     */
    getListenersCount(): number {
        return this._listeners.size();
    }

    /**
     * Attaches a listener to this event. The listener
     * will be called for every change related to the listenable.
     *
     * Please not that for Events the old value is always `undefined` as there
     * is no state preserved. Because of the same reason, Events never rise
     * the initial callback.
     *
     * @param listener the listener callback
     * @param raiseInitial ignored by Event
     */
    listen(listener: ListenerCallback<T>, raiseInitial?: boolean): Disposable {
        return this._listeners.add(listener, undefined);
    }

    /**
     * Triggers the event and notifies all the listeners.
     * @param data data object to pass to the listeners
     */
    trigger(data: T) {
        this._listeners.notify(data, undefined, { reason: DataChangeReason.replace, portion: data });
    }
}