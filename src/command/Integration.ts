/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="CommandManager.ts"/>

module JohnSmith.Command {
    class EventArgumentProcessor implements Common.IHandlerArgumentProcessor {
        public canProcess(argument:any, argumentIndex: number, options: any, context:JohnSmith.Common.IElement) : bool {
            return (typeof argument == "string") && argumentIndex == 1
        }

        public process(argument:any, options: any, /*bindable:IBindable,*/ context:JohnSmith.Common.IElement) {
            options.event = argument;
        }
    }

    var commandCauseArgumentProcessors:Common.IHandlerArgumentProcessor[] = [];
    var commandCauseFactories:ICommandCauseFactory[] = [];

    Common.JS.ioc.register(
        "commandManager",
        new DefaultCommandManager(commandCauseArgumentProcessors, commandCauseFactories));

    Common.JS.on = function (...causeData: any[]){
        var commandManager = Common.JS.ioc.resolve("commandManager");
        return new CommandConfig(causeData, commandManager, null);
    };

    Common.JS.addCommandCauseArgumentProcessor = function(processor:Common.IHandlerArgumentProcessor){
        commandCauseArgumentProcessors.push(processor);
    };

    Common.JS.addCommandCauseFactory = function(factory:ICommandCauseFactory){
        commandCauseFactories.push(factory);
    };

    Common.JS.addCommandCauseArgumentProcessor(new EventArgumentProcessor());
}