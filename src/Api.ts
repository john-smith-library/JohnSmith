/// <reference path="Common.ts"/>
/// <reference path="binding/BindableList.ts"/>
/// <reference path="binding/BindableValue.ts"/>
/// <reference path="binding/Contracts.ts"/>
/// <reference path="binding/BindableManager.ts"/>
/// <reference path="binding/CallbackHandler.ts"/>
/// <reference path="binding/DependentValue.ts"/>
/// <reference path="binding/RenderListHandler.ts"/>
/// <reference path="binding/RenderValueHandler.ts"/>
/// <reference path="view/Contracts.ts"/>
/// <reference path="view/DefaultViewFactory.ts"/>
/// <reference path="view/Integration.ts"/>
/// <reference path="command/CommandManager.ts"/>
/// <reference path="command/Contracts.ts"/>
/// <reference path="command/Integration.ts"/>
/// <reference path="Fetchers.ts"/>
/// <reference path="JQuery.ts"/>

module JohnSmith.Api {
//    class Configurer {
//        private _bindable
//    }

    /////////////////////////////////
    // Exposing public API
    /////////////////////////////////

    var jsVarName = "js";
    window[jsVarName] = window[jsVarName] || {}
    var JS = window[jsVarName];

    /////////////////////////////////
    // Events bus
    /////////////////////////////////
    JS.event = {};
    JS.event.bus = new Common.DefaultEventBus();

    /////////////////////////////////
    // Ioc Container
    /////////////////////////////////
    var ioc:Common.IContainer = new Common.Container();

    JS.ioc = ioc;

    JS.createIocContainer = function(){
        return new Common.Container();
    };

    var configureDependencies = function configureDependencies(container: Common.IContainer){

    };

    configureDependencies(JS.ioc);

    /////////////////////////////////
    // Binding
    /////////////////////////////////
    JS.bindableValue = function():JohnSmith.Binding.BindableValue {
        return new Binding.BindableValue();
    };

    JS.bindableList = function():JohnSmith.Binding.BindableList {
        return new Binding.BindableList();
    };

    var handlerFactories:Binding.IHandlerFactory[] = [];
    var handlerArgumentProcessors:Common.IArgumentProcessor[] = [];

    JS.getHandlerFactories = function():Binding.IHandlerFactory[] {
        return handlerFactories;
    }

    JS.addHandlerFactory = function(transformer: Binding.IHandlerFactory) {
        // todo insert?
        handlerFactories.push(transformer);
    }

    JS.addHandlerArgumentProcessor = function(processor){
        handlerArgumentProcessors.push(processor);
    }

    JS.addHandlerFactory(new Binding.ManualHandlerFactory());

    JS.addHandlerArgumentProcessor(new Binding.CallbackArgumentProcessor());

    JS.addHandlerFactory(new Binding.CallbackHandlerFactory());

    var bindingManager = new Binding.DefaultBindingManager(handlerFactories, handlerArgumentProcessors);

    ioc.register("bindingManager", bindingManager);

    JS.bind = function(bindable: any): JohnSmith.Binding.BindingConfig {
        return new Binding.BindingConfig(bindingManager, bindable, null, JS, true);
    };

    JS.dependentValue = function (...args: any[]):Binding.DependentValue {
        var dependencies:Binding.IBindable[] = [];
        for (var i = 0; i < args.length - 1; i++) {
            dependencies.push(args[i]);
        }

        return new Binding.DependentValue(args[args.length - 1], dependencies);
    }

    JS.ioc.withRegistered(
        function(
            destinationFactory:Common.IElementFactory,
            markupResolver:Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            fetcherFactory: Fetchers.IFetcherFactory){
            JS.addHandlerFactory(new Binding.RenderListFactory(destinationFactory, markupResolver, viewFactory, fetcherFactory));
        },
        "elementFactory",
        "markupResolver",
        "viewFactory",
        "fetcherFactory");

    JS.ioc.withRegistered(
        function(
            destinationFactory:Common.IElementFactory,
            markupResolver:Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            fetcherFactory: Fetchers.IFetcherFactory){
            JS.addHandlerFactory(new Binding.RenderValueFactory(destinationFactory, markupResolver, viewFactory, fetcherFactory));
        },
        "elementFactory",
        "markupResolver",
        "viewFactory",
        "fetcherFactory");

    /////////////////////////////////
    // Commands
    /////////////////////////////////

    var commandCauseArgumentProcessors:JohnSmith.Common.IArgumentProcessor[] = [];

    JS.ioc.registerWithDependencies(
        "commandManager",
        function(elementFactory: Common.IElementFactory, fetcherFactory: Fetchers.IFetcherFactory){
            return new Command.DefaultCommandManager(commandCauseArgumentProcessors, elementFactory, fetcherFactory);
        },
        "elementFactory",
        "fetcherFactory");

    JS.on = function (...causeData: any[]){
        var commandManager = JS.ioc.resolve("commandManager");
        return new Command.CommandConfig(causeData, commandManager, null);
    };

    JS.addCommandCauseArgumentProcessor = function(processor:JohnSmith.Common.IArgumentProcessor){
        commandCauseArgumentProcessors.push(processor);
    };

    JS.addCommandCauseArgumentProcessor(new Command.EventArgumentProcessor());

    /////////////////////////////////
    // Views
    /////////////////////////////////

    JS.ioc.registerWithDependencies(
        "viewFactory",
        function(bindableManager: Binding.IBindableManager,
                 commandManager: Command.ICommandManager,
                 elementFactory: Common.IElementFactory,
                 markupResolver: Common.IMarkupResolver){
            return new View.DefaultViewFactory(bindableManager, commandManager, elementFactory, JS.event.bus, markupResolver);
        },
        "bindingManager",
        "commandManager",
        "elementFactory",
        "markupResolver"
    )

    JS.ioc.withRegistered(
        function(viewFactory:View.IViewFactory){
            JS.addHandlerArgumentProcessor(new View.ViewArgumentProcessor(viewFactory));
        },
        "viewFactory");

    JS.createView = function(viewDescriptor: any, viewModel:any): View.IView{
        var viewFactory = JS.ioc.resolve("viewFactory");
        return viewFactory.resolve(viewDescriptor, viewModel);
    };

    JS.renderView = function(viewDescriptor: any, viewModel:any): any {
        var viewFactory = JS.ioc.resolve("viewFactory");
        var view = viewFactory.resolve(viewDescriptor, viewModel);
        return {
            to: function(destination: any){
                view.renderTo(destination);
            }
        }
    };

    JS.attachView = function(viewDescriptor: any, viewModel:any): any {
        var viewFactory = JS.ioc.resolve("viewFactory");
        var view = viewFactory.resolve(viewDescriptor, viewModel);
        return {
            to: function(destination: any){
                view.attachTo(destination);
            }
        }
    };

    /////////////////////////////////
    // Fetchers
    /////////////////////////////////
    JS.ioc.register("fetcherFactory", Fetchers.factory);

    /////////////////////////////////
    // jQuery
    /////////////////////////////////

    JS.ioc.register(
        "elementFactory",
        {
            createElement: function(query:string){
                return new JQuery.JQueryElement($(query))
            }
        }
    );

    JS.addHandlerArgumentProcessor(new JQuery.JQueryTargetArgumentProcessor());
    JS.addCommandCauseArgumentProcessor(new JQuery.JQueryTargetArgumentProcessor());

    JS.ioc.register("markupResolver", new JQuery.JQueryMarkupResolver());
}