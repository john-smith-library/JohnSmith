/**
 * @module reactive
 */

import {ObservableValue} from './observable-value';
import {ChangeDetails, DataChangeReason} from './listenable';
import {ArrayUtils} from '../utils/array';

export class ObservableList<T> extends ObservableValue<T[]> {
    private _count: ObservableValue<number>|null = null;

    constructor(value?: T[]|null){
        super(value === undefined ? [] : value);
    }

    public setValue(value: T[]|null) {
        if (value){
            if (!(value instanceof Array)){
                throw new Error("Observable list supports only array values");
            }
        }

        super.setValue(value);
        this.notifyCountListeners();
    }

    public add(...args:T[]): void {
        const currentValue = this.getValue();
        if (currentValue === null) {
            this.setValue(args);
        } else {
            const oldValue = currentValue.slice(0);

            for (let i = 0; i < args.length; i++){
                currentValue.push(args[i]);
            }

            this.reactOnChange(currentValue, oldValue, { reason: DataChangeReason.add, portion: args } );
        }
    }

    public remove(...args:T[]):void {
        const currentValue = this.getValue();
        if (currentValue !== null) {
            const
                oldValue = currentValue.slice(0),
                array:T[] = currentValue;

            for (let i = 0; i < args.length; i++){
                ArrayUtils.removeItem(array, args[i]);
            }

            this.reactOnChange(array, oldValue, { reason: DataChangeReason.remove, portion: args } );
        }
    }

    /** Removes all items from the list */
    public clear(): void {
        const currentValue = this.getValue();
        if (currentValue !== null) {
            const removed = currentValue.splice(0, currentValue.length);
            this.reactOnChange(currentValue, removed, { reason: DataChangeReason.remove, portion: removed } );
        }
    }

    /** Returns a bindable value that stores size of the list */
    public count(): ObservableValue<number> {
        if (this._count === null) {
            this._count = new ObservableValue<number>();
            this.notifyCountListeners();
        }

        return this._count;
    }

    public forEach(callback: ((item: T) => void), thisArg?: any){
        const array:T[] = this.getValue() || [];
        array.forEach(callback, thisArg);
    }

    private reactOnChange(newItems: T[], oldItems: T[], details: ChangeDetails<T[]>):void{
        this._listeners.notify(newItems, oldItems, details);
        this.notifyCountListeners();
    }

    private notifyCountListeners():void {
        if (this._count){
            let value = this.getValue();
            if (value !== null) {
                this._count.setValue(value.length);
            } else {
                this._count.setValue(0);
            }
        }
    }
}