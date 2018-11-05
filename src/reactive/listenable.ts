import { Disposable } from "../common";

export enum DataChangeReason {
    replace,
    initial,
    add,
    remove
}

export interface ChangeDetails<T> {
    reason: DataChangeReason;
    portion?: T|null;
}

export interface ListenerCallback<T> {
    (value: T, oldValue: T, details: ChangeDetails<T>): void;
}

export interface Listenable<T> {
    listen(listener:  ListenerCallback<T>, raiseInitial?: boolean): Disposable;
}

export interface BidirectionalListenable<T> extends Listenable<T> {
    requestUpdate(newValue: T|null): void;
}

export abstract class Observable<T> implements Listenable<T> {
    abstract getValue(): T;

    abstract listen(listener:  ListenerCallback<T>, raiseInitial?: boolean): Disposable;
}

export const isListenable = <T>(
    source: (Listenable<T>)|T): source is Listenable<T> => {

    return !!(<Listenable<T>>source).listen;
};