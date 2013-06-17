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
        private elementFactory:JohnSmith.Common.IElementFactory;
        private bindableManager:JohnSmith.Binding.IBindableManager;
        private commandManager: Command.ICommandManager;
        private eventBus:JohnSmith.Common.IEventBus;
        private markupResolver:JohnSmith.Common.IMarkupResolver;

        constructor (
            bindableManager:JohnSmith.Binding.IBindableManager,
            commandManager: Command.ICommandManager,
            elementFactory:JohnSmith.Common.IElementFactory,
            eventBus:JohnSmith.Common.IEventBus,
            markupResolver:JohnSmith.Common.IMarkupResolver){

            this.bindableManager = bindableManager;
            this.commandManager = commandManager;
            this.elementFactory = elementFactory;
            this.eventBus = eventBus;
            this.markupResolver = markupResolver;
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
                    this.bindableManager,
                    this.commandManager,
                    this.elementFactory,
                    <IViewData> dataDescriptor,
                    viewModel,
                    this.eventBus,
                    this,
                    this.markupResolver);
            }

            if (dataDescriptor.renderTo && dataDescriptor.getRootElement){
                return <IView> dataDescriptor;
            }

            throw new Error("Could not resolve view data by provided descriptor");
        }
    }
}
