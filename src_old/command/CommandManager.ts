/// <reference path="../Common.ts"/>
/// <reference path="../Fetchers.ts"/>
/// <reference path="Contracts.ts"/>

module JohnSmith.Command {
    export class EventCommandCause implements Command.ICommandCause {
        private _targetElement:Common.IElement;
        private _event:string;
        private _commandContext:any;
        private _argumentsFetcher: ICommandArgumentsFetcher;
        private _handlerRef: any;

        constructor(targetElement:Common.IElement, event:string, commandContext:any, argumentsFetcher: ICommandArgumentsFetcher){
            this._targetElement = targetElement;
            this._event = event;
            this._commandContext = commandContext;
            this._argumentsFetcher = argumentsFetcher;
        }

        public wireWith(command:Command.ICommand):void {
            var context = this._commandContext;
            var argumentsFetcher = this._argumentsFetcher;

            this._handlerRef = this._targetElement.attachEventHandler(
                this._event,
                function(target: Common.IElement) {
                    var commandArguments = argumentsFetcher == null ?
                        [] : argumentsFetcher.fetch(target);

                    command.execute.apply(context, commandArguments);
                });
        }

        public dispose(): void {
            this._targetElement.detachEventHandler(this._event, this._handlerRef);
        }
    }

    class FetcherToArgumentFetcherAdapter implements ICommandArgumentsFetcher {
        private _fetcher: Fetchers.IFetcher;

        constructor(fetcher: Fetchers.IFetcher){
            this._fetcher = fetcher;
        }

        public fetch(target:Common.IElement): any[] {
            return [this._fetcher.valueFromElement(target)];
        }
    }

    interface CommandCauseOptions {
        to?: string;
        event?: string;
        fetch?: string;
        argumentsFetcher?: ICommandArgumentsFetcher;
    }

    export class DefaultCommandManager extends Common.ArgumentProcessorsBasedHandler implements ICommandManager {
        private _elementFactory: Common.IElementFactory;
        private _fetcherFactory: Fetchers.IFetcherFactory;

        constructor(argumentProcessors: JohnSmith.Common.IArgumentProcessor[], elementFactory: Common.IElementFactory, fetcherFactory: Fetchers.IFetcherFactory){
            super(argumentProcessors);
            this._elementFactory = elementFactory;
            this._fetcherFactory = fetcherFactory;
        }

        public setUpBinding(data:ICommandBindingData): CommandWire {
            var command = this.getCommand(data.command);
            if (!data.commandContext){
                data.commandContext = command;
            }

            var cause = this.getCause(data.causeData, data.context, data.commandContext);
            return new CommandWire(command, cause);
        }

        private getCommand(command: any) : ICommand {
            if (Common.TypeUtils.isFunction(command)) {
                var result = {
                    execute: command
                };

                return <ICommand> result;
            }

            if (command.execute) {
                return <ICommand> command;
            }

            throw new Error("Could not transform " + command + " to command object");
        }

        private getCause(causeData: any[], context:Common.IElement, commandContext: any) : ICommandCause {
            var options = this.processArguments(causeData, context);
            return this.getCauseByOptions(options, context, commandContext);
        }

        private getCauseByOptions(commandCauseOptions: any, context:Common.IElement, commandContext: any):ICommandCause {
            var options:CommandCauseOptions = commandCauseOptions;
            if (!options.to) {
                throw new Error("Required option 'to' is not set!");
            }

            if (!options.event) {
                throw new Error("Required option 'event' is not set!");
            }

            var target = context == null ?
                this._elementFactory.createElement(options.to) :
                context.findRelative(options.to);

            if (!options.argumentsFetcher) {
                var fetcher: Fetchers.IFetcher = null;
                if (options.fetch) {
                    fetcher = this._fetcherFactory.getByKey(options.fetch);
                } else {
                    fetcher = this._fetcherFactory.getForElement(target);
                }

                if (fetcher) {
                    options.argumentsFetcher = new FetcherToArgumentFetcherAdapter(fetcher);
                }
            }

            return new EventCommandCause(target, options.event, commandContext, options.argumentsFetcher);
        }
    }
}
