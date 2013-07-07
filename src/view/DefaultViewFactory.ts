/// <reference path="../Common.ts"/>
/// <reference path="../binding/Contracts.ts"/>
/// <reference path="../command/Contracts.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="DefaultView.ts"/>

module JohnSmith.View {
    /**
     * Default implementation of IViewFactory
     */
    export class DefaultViewFactory implements IViewFactory {
        private _elementFactory:JohnSmith.Common.IElementFactory;
        private _bindableManager:JohnSmith.Binding.IBindableManager;
        private _commandManager: Command.ICommandManager;
        private _eventBus:JohnSmith.Common.IEventBus;
        private _markupResolver:JohnSmith.Common.IMarkupResolver;

        constructor (
            bindableManager:JohnSmith.Binding.IBindableManager,
            commandManager: Command.ICommandManager,
            elementFactory:JohnSmith.Common.IElementFactory,
            eventBus:JohnSmith.Common.IEventBus,
            markupResolver:JohnSmith.Common.IMarkupResolver){

            this._bindableManager = bindableManager;
            this._commandManager = commandManager;
            this._elementFactory = elementFactory;
            this._eventBus = eventBus;
            this._markupResolver = markupResolver;
        }

        public resolve(dataDescriptor: any, viewModel: any) : IView {
            if (!dataDescriptor){
                throw new Error("Expected view data object was not defined")
            }

            if (JohnSmith.Common.TypeUtils.isFunction(dataDescriptor)){
                var newInstance = new dataDescriptor();
                return this.resolve(newInstance, viewModel);
            }

            if (dataDescriptor.template){
                return new DefaultView(
                    this._bindableManager,
                    this._commandManager,
                    this._elementFactory,
                    <IViewData> dataDescriptor,
                    viewModel,
                    this._eventBus,
                    this,
                    this._markupResolver);
            }

            if (dataDescriptor.renderTo && dataDescriptor.getRootElement){
                return <IView> dataDescriptor;
            }

            throw new Error("Could not resolve view data by provided descriptor");
        }
    }
}
