export interface IEvent<TEventArg> {
    listen(listener: () => void) : IDisposable;
    listen(listener: (arg:TEventArg) => void) : IDisposable;
}

export class Event<TEventArg> implements IEvent<TEventArg>, IDisposable {
    private _listeners: Function[];

    constructor(){
        this._listeners = [];
    }

    public listen(listener: () => void) : IDisposable;
    public listen(listener: (arg:TEventArg) => void) : IDisposable;
    public listen(listener: Function) : IDisposable {
        var that = this;
        this._listeners.push(listener);
        return <IDisposable> {
            dispose: function(): void{
                that.removeListener(listener);
            }
        };
    }

    public trigger():void;
    public trigger(arg:TEventArg):void;
    public trigger(arg?:TEventArg):void {
        for (var i = 0; i < this._listeners.length; i++){
            this._listeners[i](arg);
        }
    }

    public dispose():void {
        this._listeners = null;
    }

    public getListenersCount(){
        if (this._listeners === null) {
            return 0;
        }

        return this._listeners.length;
    }

    public hasListeners():boolean{
        return this.getListenersCount() > 0;
    }

    private removeListener(listener: Function):void {
        ArrayUtils.removeItem(this._listeners, listener);
    }
}