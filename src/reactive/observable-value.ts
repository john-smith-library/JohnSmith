/**
 * @module reactive
 */

import {ChangeDetails, DataChangeReason, ListenerCallback, Observable} from "./listenable";
import {Disposable } from "../common";
import {ListenerLink} from "./listener-link";

export class ObservableValue<T> extends Observable<T|null> {
    private _listeners: ListenerCallback<T|null>[] = [];
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
        this.notifyListeners(value, oldValue, { reason: DataChangeReason.replace, portion: value } );
    }

    public listen(listener: ListenerCallback<T|null>, raiseInitial?: boolean): Disposable {
        this._listeners.push(listener);
        if (raiseInitial === undefined || raiseInitial === true) {
            listener(this.getValue(), null, { reason: DataChangeReason.initial, portion: this.getValue() })
        }

        return new ListenerLink(this._listeners, listener);
    }

    public getListenersCount(): number {
        return this._listeners.length;
    }

    public getListener(index: number): ListenerCallback<T> {
        return this._listeners[index];
    }

    public notifyListeners(newValue:T|null, oldValue:T|null, details: ChangeDetails<T>): void {
        for (let i = 0; i < this._listeners.length; i++) {
            this._listeners[i](newValue, oldValue, details);
        }
    }

    public hasValue(): boolean {
        return !(this._value == null);
    }
}

