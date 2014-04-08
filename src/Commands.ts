export interface ICommandArgumentFetcher {
    (target:IElement): any;
}

export class CommandConfig {
    constructor(
        private _manager: IManager,
        private _event: string,
        private _target: IElement){
    }

    react(callback: Function, context: any): void {
        this._manager.manage(new CommandWire(null, this._event, callback, this._target, context))
    }
}

export class CommandWire implements IManageable {
    private _handlerRef: any;

    constructor(
        private _argumentFetcher: ICommandArgumentFetcher,
        private _eventType: string,
        private _callback: Function,
        private _target: IElement,
        private _context: any){
    }

    dispose():void {
        this._target.detachEventHandler(this._eventType, this._handlerRef);
    }

    init():void {
        this._handlerRef = this._target.attachEventHandler(this._eventType, () => {
            var commandArgument = this._argumentFetcher == null ? null : this._argumentFetcher(this._target);
            if (commandArgument == null) {
                this._callback.call(this._context, commandArgument);
            } else {
                this._callback.call(this._context);
            }
        });
    }
}