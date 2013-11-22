/// <reference path="../Common.ts"/>
/// <reference path="../Fetchers.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="CommandManager.ts"/>

module JohnSmith.Command {
    export class EventArgumentProcessor implements JohnSmith.Common.IArgumentProcessor {
        public canProcess(argument:any, argumentIndex: number, options: any, context:JohnSmith.Common.IElement) : boolean {
            return (typeof argument == "string") && argumentIndex == 1
        }

        public process(argument:any, options: any, context:JohnSmith.Common.IElement) {
            options.event = argument;
        }
    }


}