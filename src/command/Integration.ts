/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="CommandManager.ts"/>

module JohnSmith.Command {
    class EventArgumentProcessor implements JohnSmith.Common.IArgumentProcessor {
        public canProcess(argument:any, argumentIndex: number, options: any, context:JohnSmith.Common.IElement) : bool {
            return (typeof argument == "string") && argumentIndex == 1
        }

        public process(argument:any, options: any, context:JohnSmith.Common.IElement) {
            options.event = argument;
        }
    }

    var commandCauseArgumentProcessors:JohnSmith.Common.IArgumentProcessor[] = [];

    Common.JS.ioc.registerWithDependencies(
        "commandManager",
        function(elementFactory: Common.IElementFactory){
            return new DefaultCommandManager(commandCauseArgumentProcessors, elementFactory);
        },
        "elementFactory");

    Common.JS.on = function (...causeData: any[]){
        var commandManager = Common.JS.ioc.resolve("commandManager");
        return new CommandConfig(causeData, commandManager, null);
    };

    Common.JS.addCommandCauseArgumentProcessor = function(processor:JohnSmith.Common.IArgumentProcessor){
        commandCauseArgumentProcessors.push(processor);
    };

    Common.JS.addCommandCauseArgumentProcessor(new EventArgumentProcessor());
}