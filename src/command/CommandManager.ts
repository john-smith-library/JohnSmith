/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>

module JohnSmith.Command {
    export class EventCommandCause implements Command.ICommandCause {
        private _targetElement:Common.IElement;
        private _event:string;
        private _commandContext:any;

        constructor(targetElement:Common.IElement, event:string, commandContext:any){
            this._targetElement = targetElement;
            this._event = event;
            this._commandContext = commandContext;
        }

        public wireWith(command:Command.ICommand):void {
            var context = this._commandContext;
            this._targetElement.attachEventHandler(
                this._event,
                function(target: Common.IElement) {
                    command.execute.call(context);
                });
        }

        public dispose(): void {
        }
    }

    interface CommandCauseOptions {
        to?: string;
        event?: string;
    }

    export class DefaultCommandManager extends Common.ArgumentProcessorsBasedHandler implements ICommandManager {
        private _elementFactory: Common.IElementFactory;

        constructor(argumentProcessors: JohnSmith.Common.IArgumentProcessor[], elementFactory: Common.IElementFactory){
            super(argumentProcessors);
            this._elementFactory = elementFactory;
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

            return new EventCommandCause(target, options.event, commandContext);
        }
    }
}
