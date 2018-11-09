/**
 * @module reactive
 */

import {DataChangeReason, ListenerCallback, Listeners, ReadonlyObservable} from "./listenable";
import {Disposable} from '../common';

export class ObservableValue<T> extends ReadonlyObservable<T|null> {
    protected _listeners = new Listeners<T|null>();
    private _value: T|null = null;

    constructor(value?: T | null) {
        super();
        this._value = value || null;
    }

    public getValue(): T|null {
        return this._value;
    }

    public getRequiredValue(): T {
        if (this._value === null) {
            throw new Error('Expected a value but was null');
        }

        return this._value;
    }

    public setValue(value: T|null) {
        const oldValue = this._value;

        this._value = value;
        this._listeners.notify(value, oldValue, { reason: DataChangeReason.replace, portion: value });
        //this.notifyListeners(value, oldValue, { reason: DataChangeReason.replace, portion: value } );
    }

    public hasValue(): boolean {
        return !(this._value == null);
    }

    getListenersCount(): number {
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
    listen(listener: ListenerCallback<T | null>, raiseInitial?: boolean): Disposable {
        const initial = raiseInitial === undefined || raiseInitial === true ? this.getValue() : undefined;
        return this._listeners.add(listener, initial);
    }
}