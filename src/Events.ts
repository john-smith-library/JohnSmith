/// <reference path="Common.ts"/>

module JohnSmith.Events {
    export interface IEvent<TEventArg> {
        listen(listener: () => void) : Common.IDisposable;
        listen(listener: (arg:TEventArg) => void) : Common.IDisposable;
    }

    export class Event<TEventArg> implements IEvent<TEventArg>, Common.IDisposable {
        private _listeners: Function[];

        constructor(){
            this._listeners = [];
        }

        public listen(listener: () => void) : Common.IDisposable;
        public listen(listener: (arg:TEventArg) => void) : Common.IDisposable;
        public listen(listener: Function) : Common.IDisposable {
            var that = this;
            this._listeners.push(listener);
            return <Common.IDisposable> {
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
            Common.ArrayUtils.removeItem(this._listeners, listener);
        }
    }
}
