export interface ICommandOptions {
    fetch?: string;
}

export interface ICommandArgumentFetcher {
    (target:IElement): any;
}

export class CommandConfig {
    constructor(
        private _manager: IDomManager,
        private _event: string,
        private _target: IElement,
        private _options: ICommandOptions,
        private _fetcherFactory: IFetcherFactory){
    }

    react(callback: Function, context?: any): void {
        var fetcher: IFetcher = null;

        if (this._options && this._options.fetch) {
            fetcher = this._fetcherFactory.getByKey(this._options.fetch);
        } else {
            fetcher = this._fetcherFactory.getForElement(this._target);
        }

        var argumentFetcher: ICommandArgumentFetcher = null;
        if (fetcher) {
            argumentFetcher = (target: IElement) => fetcher.valueFromElement(target);
        }

        var actualContext = context || this._manager.getViewModel();
        var wire = new CommandWire(argumentFetcher, this._event, callback, this._target, actualContext);
        this._manager.manage(wire)
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
                this._callback.call(this._context);
            } else {
                this._callback.call(this._context, commandArgument);
            }
        });
    }
}