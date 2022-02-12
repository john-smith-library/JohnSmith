import { Disposable } from "../common";
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
    remove
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
export interface ListenerCallback<T> {
    (value: T, oldValue: T|undefined, details: ChangeDetails<T>): void;
}

class ListenerLink<T> implements Disposable {
    constructor(private allListeners:  ListenerCallback<T>[], private currentListener: ListenerCallback<T>){
    }

    dispose(){
        ArrayUtils.removeItem(this.allListeners, this.currentListener);
    }
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
    abstract listen(listener:  ListenerCallback<T>, raiseInitial?: boolean): Disposable;

    /**
     * Returns the number of listeners attached to the listenable.
     */
    abstract getListenersCount(): number;
}

/**
 * A helper class to encapsulate the logic of listener
 * callbacks management via composition. This class is for
 * internal framework usages.
 */
export class Listeners<T> {
    private _items: ListenerCallback<T>[] = [];

    add(listener:  ListenerCallback<T>, initial:T|undefined) : Disposable {
        this._items.push(listener);
        if (initial !== undefined) {
            listener(initial, undefined, { reason: DataChangeReason.initial, portion: initial })
        }

        return new ListenerLink(this._items, listener);
    }

    notify(newValue:T, oldValue:T|undefined, details: ChangeDetails<T>): void {
        for (let i = 0; i < this._items.length; i++) {
            this._items[i](newValue, oldValue, details);
        }
    }

    size() {
        return this._items.length;
    }
}

export interface BidirectionalListenable<T> extends Listenable<T> {
    requestUpdate(newValue: T|null): void;
}

export abstract class ReadonlyObservable<T> extends Listenable<T> {
    abstract getValue(): T;
}

export const isListenable = <T>(
    source: (Listenable<T>)|T): source is Listenable<T> => {

    return !!(<Listenable<T>>source).listen;
};
