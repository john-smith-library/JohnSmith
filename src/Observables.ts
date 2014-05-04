/// <reference path="Common.ts"/>
/// <reference path="Utils.ts"/>

export enum DataChangeReason {
    replace,
    add,
    remove,
    initial
}

export interface IChangeDetails<T> {
    reason: DataChangeReason;
    portion: T;
}

export interface IListenerCallback<T> {
    (value: T, oldValue?: T, details?: IChangeDetails<T>): void;
}

export interface IObservable<T> {
    getValue(): T;
    listen(listener:  IListenerCallback<T>, raiseInitial?: boolean): IDisposable;
}

export class ListenerLink<T> implements IDisposable {
    constructor(private allListeners:  IListenerCallback<T>[], private currentListener: IListenerCallback<T>){
    }

    dispose(){
        ArrayUtils.removeItem(this.allListeners, this.currentListener);
    }
}

export class ObservableValue<T> implements IObservable<T> {
    private _listeners: IListenerCallback<T>[];
    private _value: T ;

    constructor() {
        this._listeners = [];
    }

    public getValue():T {
        return this._value;
    }

    public setValue(value: T) {
        var oldValue = this._value;
        this._value = value;
        this.notifyListeners(value, oldValue, { reason: DataChangeReason.replace, portion: value } );
    }

    public listen(listener: IListenerCallback<T>, raiseInitial?: boolean): IDisposable {
        this._listeners.push(listener);
        if (raiseInitial === undefined || raiseInitial === true) {
            this.notifyListeners(this.getValue(), this.getValue(), { reason: DataChangeReason.initial, portion: this.getValue() });
        }

        return new ListenerLink(this._listeners, listener);
    }

    public getListenersCount(): number {
        return this._listeners.length;
    }

    public getListener(index: number): IListenerCallback<T> {
        return this._listeners[index];
    }

    public notifyListeners(newValue:T, oldValue:T, details: IChangeDetails<T>): void {
        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i](newValue, oldValue, details);
        }
    }

    public hasValue(): boolean {
        if (this._value == null || this._value == undefined) {
            return false;
        }

        return true;
    }
}

export class ObservableList<T> extends ObservableValue<T[]> {
    private _count: ObservableValue<number>;

    constructor(){
        super();
        super.setValue([]);
    }

    public setValue(value: T[]) {
        if (value){
            if (!(value instanceof Array)){
                throw new Error("Observable list supports only array values");
            }
        }

        super.setValue(value);
        this.notifyCountListeners();
    }

    public add(...args:T[]): void {
        var oldValue = this.getValue().slice(0);
        var array:T[] = this.getValue();
        for (var i = 0; i < args.length; i++){
            array.push(args[i]);
        }

        this.reactOnChange(this.getValue(), oldValue, { reason: DataChangeReason.add, portion: args } );
    }

    public remove(...args:T[]):void {
        var oldValue = this.getValue().slice(0);
        var array:T[] = this.getValue();
        for (var i = 0; i < args.length; i++){
            ArrayUtils.removeItem(array, args[i]);
        }

        this.reactOnChange(this.getValue(), oldValue, { reason: DataChangeReason.remove, portion: args } );
    }

    /** Removes all items from the list */
    public clear(): void {
        var removed = this.getValue().splice(0, this.getValue().length);
        this.reactOnChange(this.getValue(), removed, { reason: DataChangeReason.remove, portion: removed } );
    }

    /** Returns a bindable value that stores size of the list */
    public count(): ObservableValue<number> {
        if (!this._count) {
            this._count = new ObservableValue<number>();
            this.notifyCountListeners();
        }

        return this._count;
    }

    public forEach(callback, thisArg){
        var array:T[] = this.getValue();
        array.forEach(callback, thisArg);
    }

    private reactOnChange(newItems: T[], oldItems: T[], details: IChangeDetails<T[]>):void{
        super.notifyListeners(newItems, oldItems, details);
        this.notifyCountListeners();
    }

    private notifyCountListeners():void {
        if (this._count){
            if (this.getValue()) {
                this._count.setValue(this.getValue().length);
            } else {
                this._count.setValue(0);
            }
        }
    }
}

export class DependentValue<T> extends ObservableValue<T> {
    private _evaluateValue: () => any;
    private _dependencies: IObservable<any>[];
    private _dependencyValues: any[];

    constructor(evaluate: () => any, dependencies: IObservable<any>[]) {
        super();

        this._dependencies = dependencies;
        this._evaluateValue = evaluate;
        this._dependencyValues = [];

        var that = this;
        for (var i = 0; i < dependencies.length; i++) {
            var dependency: IObservable<any> = dependencies[i];
            dependency.listen(function(newValue: Object, oldValue: Object, details: IChangeDetails<any>) {
                var actualValue = newValue;
                if (details.reason !== DataChangeReason.replace) {
                    actualValue = dependency.getValue();
                }

                that.notifyDependentListeners(dependency, actualValue);
            }, false);

            this._dependencyValues[i] = dependency.getValue();
        }
    }

    public getValue():any {
        return this._evaluateValue.apply(this, this._dependencyValues);
    }

    public setValue(value: any) {
        throw Error("Could not set dependent value");
    }

    public notifyDependentListeners(causedByDependency:IObservable<any>, newDependencyValue: any): void {
        var oldValue = this.getValue();
        for (var i = 0; i < this._dependencies.length; i++) {
            var dependency = this._dependencies[i];
            if (dependency === causedByDependency) {
                this._dependencyValues[i] = newDependencyValue;
            }
        }

        var newValue = this.getValue();
        for (var i = 0; i < this.getListenersCount(); i++) {
            var listener:IListenerCallback<any>  = this.getListener(i);
            listener(newValue, oldValue, { portion: newValue, reason: DataChangeReason.replace });
        }
    }
}

export class StaticObservableValue<T> implements IObservable<T> {
    constructor(private _value:T) {
    }

    public getValue(): T {
        return this._value;
    }

    listen(listener:IListenerCallback<T>):IDisposable {
        listener(this.getValue(), null, { reason: DataChangeReason.initial, portion: this.getValue() });
        return { dispose: function(){} };
    }
}