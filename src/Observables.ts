enum DataChangeReason {
    replace,
    add,
    remove,
}

interface IListenerCallback<T> {
    (value: T, oldValue: T, reason: DataChangeReason): void;
}

interface IObservable<T> {
    listen(listener:  IListenerCallback<T>): IDisposable;
}

class ListenerLink<T> implements IDisposable {
    constructor(private allListeners:  IListenerCallback<T>[], private currentListener: IListenerCallback<T>){
    }

    dispose(){
        var indexToRemove: number = -1;
        for (var i = 0; i < this.allListeners.length; i++) {
            if (this.allListeners[i] == this.currentListener) {
                indexToRemove = i;
            }
        }

        if (indexToRemove >= 0) {
            this.allListeners.splice(indexToRemove, 1);
        }
    }
}

class ObservableValue<T> implements IObservable<T> {
    private _listeners: IListenerCallback<T>[];
    private _value: T ;

    constructor() {
        this._listeners = [];
    }

    public getValue():T {
        return this._value;
    }

    public setValue(value: T) {
        this.notifyListeners(value, DataChangeReason.replace);
        this._value = value;
    }

    public listen(listener: IListenerCallback<T>): IDisposable {
        this._listeners.push(listener);
        return new ListenerLink(this._listeners, listener);
    }

    public getListenersCount(): number {
        return this._listeners.length;
    }

    public notifyListeners(newValue:T, reason:DataChangeReason): void {
        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i](newValue, this._value, reason);
        }
    }

    public hasValue(): boolean {
        if (this._value == null || this._value == undefined) {
            return false;
        }

        return true;
    }
}

class ObservableList<T> extends ObservableValue<T[]> {
    test() {
        alert('hello!  ');
    }
}