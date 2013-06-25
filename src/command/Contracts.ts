/// <reference path="../Common.ts"/>

module JohnSmith.Command {
    export interface ICommand {
        execute(data: any[]):void;
    }

    export interface ICommandCause extends Common.IDisposable {
        wireWith(command:ICommand):void;
    }

    export interface ICommandBindingData {
        command: any;
        commandContext?: any;
        context: Common.IElement;
        causeData: any[];
    }

    export interface ICommandHost {
        on(...causeArguments: any[]): CommandConfig;
    }

    export interface ICommandArgumentsFetcher {
        fetch(target:Common.IElement): any[];
    }

    export class CommandWire implements Common.IDisposable {
        private _command: ICommand;
        private _cause: ICommandCause;

        constructor(command: ICommand, cause: ICommandCause){
            this._command = command;
            this._cause = cause;
        }

        public init(): void {
            this._cause.wireWith(this._command);
        }

        public dispose(): void {
            this._cause.dispose();
        }
    }

    export class CommandConfig {
        private _causeData: any[];
        private _commandManager: ICommandManager;
        private _context: Common.IElement;
        private _commandContext: any;

        constructor(causeData: any[], commandManager: ICommandManager, context: Common.IElement, commandContext?: any){
            this._causeData = causeData;
            this._commandManager = commandManager;
            this._context = context;
            this._commandContext = commandContext;
        }

        public do(command: any, commandContext?: any): CommandConfig {
            this._commandManager.setUpBinding({
                command: command,
                context: this._context,
                causeData: this._causeData,
                commandContext: commandContext || this._commandContext || null
            }).init();

            return this;
        }
    }

    export interface ICommandManager {
        setUpBinding(data:ICommandBindingData): CommandWire;
    }
}