/// <reference path="../Common.ts"/>
/// <reference path="../binding/Contracts.ts"/>
/// <reference path="../command/Contracts.ts"/>
/// <reference path="Contracts.ts"/>

module JohnSmith.View {
    export interface IChildView {
        child: IView;
        destination: any;
        viewModel: any;
    }

    export class DefaultView implements IView, Command.ICommandHost {
        /** Read only fields */
        private elementFactory: Common.IElementFactory;
        private bindableManager: Binding.IBindableManager;
        private commandManager: Command.ICommandManager;
        private eventBus: Common.IEventBus;
        private viewModel:IViewModel;
        private data:IViewData;
        private viewFactory:IViewFactory;
        private markupResolver:Common.IMarkupResolver;

        /** Regular fields */
        private children: IChildView[];
        private rootElement: JohnSmith.Common.IElement;

        constructor (
            bindableManager: Binding.IBindableManager,
            commandManager: Command.ICommandManager,
            elementFactory: Common.IElementFactory,
            viewData: IViewData,
            viewModel:IViewModel,
            eventBus: Common.IEventBus,
            viewFactory: IViewFactory,
            markupResolver: Common.IMarkupResolver){

            this.bindableManager = bindableManager;
            this.commandManager = commandManager;
            this.elementFactory = elementFactory;
            this.data = viewData;
            this.viewModel = viewModel;
            this.eventBus = eventBus;
            this.viewFactory = viewFactory;
            this.markupResolver = markupResolver;
        }

        public addChild(destination:any, child:IView, viewModel: any){
            if (!this.hasChildren()) {
                this.children = [];
            }

            this.children.push({
                child: child,
                destination: destination,
                viewModel: viewModel
            });
        }

        public renderTo(destination:any):void {
            var templateHtml = this.markupResolver.resolve(this.data.template);
            var destinationElement = typeof destination == "string" ?
                this.elementFactory.createElement(destination) :
                destination;

            this.rootElement = destinationElement.appendHtml(templateHtml);

            this.eventBus.trigger(
                "viewRendered",
                {
                    root: this.rootElement,
                    view: this
                });

            if (this.data.init){
                this.data.init.call(this, this.viewModel);
            }

            if (this.hasChildren()){
                for (var i = 0; i < this.children.length; i++) {
                    var childData = this.children[i];
                    var viewModel = childData.viewModel;
                    var child = this.viewFactory.resolve(childData.child, viewModel);
                    child.renderTo(this.rootElement.findRelative(childData.destination));
                }
            }

            if (this.viewModel && this.viewModel.resetState){
                this.viewModel.resetState();
            }
        }

        public bind(bindable: any): Binding.BindingConfig {
            return new Binding.BindingConfig(
                this.bindableManager,
                bindable,
                this.rootElement,
                this);
        }

        public on(...causeArguments: any[]): Command.CommandConfig {
            return new Command.CommandConfig(
                causeArguments,
                this.commandManager,
                this.getRootElement(),
                this.viewModel);
        }

        public getRootElement() : JohnSmith.Common.IElement {
            return this.rootElement;
        }

        public dispose(): void {
            // todo implement
            if (this.hasChildren()){
                for (var i = 0; i < this.children.length; i++){
                    this.children[i].child.dispose();
                }
            }
        }

        private hasChildren():bool {
            return this.children != null;
        }
    }
}