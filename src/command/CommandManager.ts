/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>

module JohnSmith.Command {
    class FunctionCommand implements ICommand {
        private _callback: () => void;

        constructor(callback: () => void) {
            this._callback = callback;
        }

        public execute(data: any[]):void {
            this._callback.call(this, data);
        }
    }

    export class DefaultCommandManager implements ICommandManager {
        private _argumentProcessors: Common.IHandlerArgumentProcessor[];
        private _factories: ICommandCauseFactory[];

        constructor(argumentProcessors: Common.IHandlerArgumentProcessor[], factories: ICommandCauseFactory[]){
            this._argumentProcessors = argumentProcessors;
            this._factories = factories;
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
            // todo extract to superclass --->
            var lastArgument = causeData[causeData.length - 1];
            var handlerOptions: any;
            if (this.isOptionsArgument(lastArgument)) {
                handlerOptions = lastArgument;
                causeData.pop();
            } else {
                handlerOptions = {};
            }

            var argumentIndex = 0;
            while (causeData.length > 0) {
                var argument = causeData[0];
                this.processHandlerArgument(argument, argumentIndex, handlerOptions, context);
                causeData.splice(0, 1);
                argumentIndex++;
            }
            // <----------------

            for (var i = 0; i < this._factories.length; i++) {
                var factory: ICommandCauseFactory = this._factories[i];
                var result: ICommandCause = factory.create(handlerOptions, context, commandContext);
                if (result) {
                    return result;
                }
            }

            throw new Error("Could not transform arguments to command cause");
        }

        // todo extract to superclass
        private processHandlerArgument(argument:any, index: number, options: any, context:Common.IElement): void {
            for (var i = 0; i < this._argumentProcessors.length; i++){
                var processor = this._argumentProcessors[i];
                if (processor.canProcess(argument, index, options, context)) {
                    processor.process(argument, options, context);
                    return;
                }
            }

            throw new Error("Could not process argument " + argument);
        }

        // todo extract to superclass
        private isOptionsArgument(value: any): bool {
            return JohnSmith.Common.TypeUtils.isObject(value);
        }
    }
}
