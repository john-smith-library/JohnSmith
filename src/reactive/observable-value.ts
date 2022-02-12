import {DataChangeReason, ListenerCallback, Listeners, ReadonlyObservable} from "./listenable";
import {Disposable} from '../common';

/**
 * Defines a stateless listenable class allowing `null` as a
 * target value.
 */
export class ObservableValue<T> extends ReadonlyObservable<T|null> {
    protected _listeners = new Listeners<T|null>();
    private _value: T|null;

    /**
     * Creates new observable value instance.
     * @param value optional initial value
     */
    constructor(value?: T | null) {
        super();
        this._value = value || null;
    }

    /**
     * Gets current value, can return `null`.
     */
    public getValue(): T|null {
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
    public setValue(value: T|null) {
        const oldValue = this._value;

        this._value = value;
        this._listeners.notify(value, oldValue, { reason: DataChangeReason.replace, portion: value });
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
