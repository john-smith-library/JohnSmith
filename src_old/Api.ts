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
    class PublicApi {
        private _bindableManager: Binding.IBindableManager;
        private _commandManager: Command.ICommandManager;
        private _viewFactory: View.IViewFactory;

        public event: any;

        constructor(bindableManager: Binding.IBindableManager, commandManager: Command.ICommandManager, viewFactory: View.IViewFactory, eventBus: Common.IEventBus){
            this._bindableManager = bindableManager;
            this._commandManager = commandManager;
            this._viewFactory = viewFactory;

            this.event = {
                bus: eventBus
            };
        }

        /**
         * Creates an observable value
         * @returns {JohnSmith.Binding.BindableValue}
         */
        public bindableValue(): Binding.BindableValue {
            return new Binding.BindableValue();
        }

        /**
         * Creates an observable list
         * @returns {JohnSmith.Binding.BindableList}
         */
        public bindableList():JohnSmith.Binding.BindableList {
            return new Binding.BindableList();
        }

        /**
         * Creates an observable object that depends on other objects
         * @param args
         * @returns {Binding.DependentValue}
         */
        public dependentValue(...args: any[]):Binding.DependentValue {
            var dependencies:Binding.IBindable[] = [];
            for (var i = 0; i < args.length - 1; i++) {
                dependencies.push(args[i]);
            }

            return new Binding.DependentValue(args[args.length - 1], dependencies);
        }

        public bind(bindable: any): JohnSmith.Binding.BindingConfig {
            return new Binding.BindingConfig(this._bindableManager, bindable, null, this, true);
        }

        public on(...causeData: any[]){
            return new Command.CommandConfig(causeData, this._commandManager, null);
        }

        public createView(viewDescriptor: any, viewModel:any): View.IView{
            return this._viewFactory.resolve(viewDescriptor, viewModel);
        }

        public renderView(viewDescriptor: any, viewModel:any): any {
            var view = this._viewFactory.resolve(viewDescriptor, viewModel);
            return {
                to: function(destination: any){
                    view.renderTo(destination);
                }
            }
        }

        public attachView(viewDescriptor: any, viewModel:any): any {
            var view = this._viewFactory.resolve(viewDescriptor, viewModel);
            return {
                to: function(destination: any){
                    view.attachTo(destination);
                }
            }
        }
    }

    class Configurer {
        private _bindableManager: Binding.IBindableManager;
        private _handlerFactories: Binding.IHandlerFactory[] = [];
        private _handlerArgumentProcessors: Common.IArgumentProcessor[] = [];
        private _commandCauseArgumentProcessors: Common.IArgumentProcessor[] = []
        private _elementFactory: Common.IElementFactory;
        private _markupResolver: Common.IMarkupResolver;
        private _fetcherFactory: Fetchers.IFetcherFactory;
        private _commandManager: Command.ICommandManager;
        private _viewFactory: View.IViewFactory;

        public configure(): PublicApi {
            var eventBus:Common.IEventBus = new Common.DefaultEventBus();

            this.createDependencies(eventBus);

            return new PublicApi(
                this._bindableManager,
                this._commandManager,
                this._viewFactory,
                eventBus);
        }

        private createDependencies(eventBus: Common.IEventBus): void {
            this._elementFactory = {
                createElement: function(query:string){
                    return new JQuery.JQueryElement($(query))
                }
            };

            this._fetcherFactory = Fetchers.factory;

            this._commandManager = new Command.DefaultCommandManager(
                this._commandCauseArgumentProcessors,
                this._elementFactory,
                this._fetcherFactory);

            this._markupResolver = new JQuery.JQueryMarkupResolver();

            this._commandCauseArgumentProcessors.push(new Command.EventArgumentProcessor());
            this._commandCauseArgumentProcessors.push(new JQuery.JQueryTargetArgumentProcessor());

            this._bindableManager = new Binding.DefaultBindingManager(this._handlerFactories, this._handlerArgumentProcessors);

            this._viewFactory = new View.DefaultViewFactory(
                this._bindableManager,
                this._commandManager,
                this._elementFactory,
                eventBus,
                this._markupResolver);

            this._handlerFactories.push(new Binding.ManualHandlerFactory());
            this._handlerFactories.push(new Binding.CallbackHandlerFactory());
            this._handlerFactories.push(new Binding.RenderListFactory(this._elementFactory, this._markupResolver, this._viewFactory, this._fetcherFactory));
            this._handlerFactories.push(new Binding.RenderValueFactory(this._elementFactory, this._markupResolver, this._viewFactory, this._fetcherFactory));

            this._handlerArgumentProcessors.push(new Binding.CallbackArgumentProcessor());
            this._handlerArgumentProcessors.push(new JQuery.JQueryTargetArgumentProcessor());
            this._handlerArgumentProcessors.push(new View.ViewArgumentProcessor(this._viewFactory));
        }
    }

    var jsVarName = window["JohnSmithAcronym"] || "js";
    window[jsVarName] = new Configurer().configure();
}