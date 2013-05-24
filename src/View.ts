/// <reference path="Common.ts"/>
/// <reference path="binding/Contracts.ts"/>
/// <reference path="binding/BindableManager.ts"/>
/// <reference path="binding/Handling.ts"/>

module JohnSmith.Views {
    export interface IViewModel {
        resetState?: () => void;
    }

    /**
     * Describes the data needed for creating a view.
     */
    export interface IViewData {
        template: any;
        init?: (viewModel: any) => void;
    }

    /**
     * View interface. For internal usage mainly, client meant to use IViewData.
     */
    export interface IView extends JohnSmith.Common.IDisposable {
        renderTo: (destination:any) => void;
        getRootElement: () => JohnSmith.Common.IElement;
    }

    interface IChildView {
        child: IView;
        destination: any;
    }

    export class DefaultView implements IView {
        /** Read only fields */
        private elementFactory:JohnSmith.Common.IElementFactory;
        private bindableManager:JohnSmith.Binding.IBindableManager;
        private eventBus:JohnSmith.Common.IEventBus;
        private viewModel:IViewModel;
        private data:IViewData;

        /** Regular fields */
        private children:IChildView[];
        private rootElement: JohnSmith.Common.IElement;

        constructor (
            bindableManager:JohnSmith.Binding.IBindableManager,
            elementFactory:JohnSmith.Common.IElementFactory,
            viewData: IViewData,
            viewModel:IViewModel,
            eventBus:JohnSmith.Common.IEventBus){

            this.bindableManager = bindableManager;
            this.elementFactory = elementFactory;
            this.data = viewData;
            this.viewModel = viewModel;
            this.eventBus = eventBus;
        }

        public addChild(destination:any, child:IView){
            if (!this.hasChildren()) {
                this.children = [];
            }

            this.children.push({
                child: child,
                destination: destination
            });
        }

        public renderTo(destination:any):void {
            var templateElement = this.elementFactory.createElement(this.data.template);

            if (templateElement.isEmpty()){
                throw new Error("Template [" + this.data.template + "] content is empty");
            }

            var destinationElement = typeof destination == "string" ?
                this.elementFactory.createElement(destination) :
                destination;

            var templateHtml = templateElement.getHtml();

            this.rootElement = destinationElement.append(templateHtml);

            this.eventBus.trigger(
                "viewRendered",
                {
                    root: this.rootElement,
                    view: this
                });

            if (this.hasChildren()){
                for (var i = 0; i < this.children.length; i++) {
                    var childData = this.children[i];
                    childData.child.renderTo(this.rootElement.findRelative(childData.destination));
                }
            }

            if (this.data.init){
                this.data.init.call(this, this.viewModel);
            }

            if (this.viewModel && this.viewModel.resetState){
                this.viewModel.resetState();
            }
        }

        public bind(bindable: any): JohnSmith.Binding.BindingConfig {
            return new JohnSmith.Binding.BindingConfig(
                this.bindableManager,
                bindable,
                this.rootElement
            )
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

    /**
     * Resolves provided vew descriptor and creates view.
     */
    export interface IViewFactory {
        resolve: (dataDescriptor: any, viewModel: any) => IView;
    }

    /**
     * Default implementation of IViewFactory
     */
    export class DefaultViewFactory implements IViewFactory {
        private elementFactory:JohnSmith.Common.IElementFactory;
        private bindableManager:JohnSmith.Binding.IBindableManager;
        private eventBus:JohnSmith.Common.IEventBus;

        constructor (
            bindableManager:JohnSmith.Binding.IBindableManager,
            elementFactory:JohnSmith.Common.IElementFactory,
            eventBus:JohnSmith.Common.IEventBus){

            this.bindableManager = bindableManager;
            this.elementFactory = elementFactory;
            this.eventBus = eventBus;
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
                    this.elementFactory,
                    <IViewData> dataDescriptor,
                    viewModel,
                    this.eventBus);
            }

            if (dataDescriptor.renderTo && dataDescriptor.getRootElement()){
                return <IView> dataDescriptor;
            }


            throw new Error("Could not resolve view data by provided descriptor");
        }
    }


    export class ViewValueRenderer implements JohnSmith.Binding.IValueRenderer {
        private viewFactory: (value:any) => IView;
        private currentView: IView;

        constructor(viewFactory: (value:any) => IView){
            this.viewFactory = viewFactory;
        }

        public render(value: any, destination: JohnSmith.Common.IElement): JohnSmith.Common.IElement {
            if (this.currentView){
                this.currentView.dispose();
            }

            this.currentView = this.viewFactory(value);
            this.currentView.renderTo(destination);

            return this.currentView.getRootElement();
        }

        public dispose(): void {
            if (this.currentView){
                this.currentView.dispose();
            }
        }
    }

    /////////////////////////////////
    // Config
    /////////////////////////////////

    JohnSmith.Common.JS.ioc.register(
        "viewFactory",
        function(ioc){
            return new DefaultViewFactory(
                <JohnSmith.Binding.IBindableManager> ioc.resolve("bindingManager"),
                <JohnSmith.Common.IElementFactory> ioc.resolve("elementFactory"),
                JohnSmith.Common.JS.event.bus);
        });

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{view: any} => {renderer: IValueRenderer} [Sets renderer for view]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0){
                if (data[0].handler === "render" && data[0].view) {
                    return JohnSmith.Binding.TransformerApplicability.Applicable;
                }
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], context: JohnSmith.Common.IElement): any{
            var viewFactory:IViewFactory = JohnSmith.Common.JS.ioc.resolve("viewFactory");
            var viewDescriptor = data[0].view;

            data[0].renderer = new ViewValueRenderer(function(viewModel){
                return viewFactory.resolve(viewDescriptor, viewModel);
            });
            return data;
        }
    });

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "[{}, any] => {view: any} [Converts second argument to view property]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0){
                if (data[0].view) {
                    return JohnSmith.Binding.TransformerApplicability.NotApplicable;
                }

                if (typeof data[0] === "object" && data.length > 1) {
                    return JohnSmith.Binding.TransformerApplicability.Applicable;
                }
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], context: JohnSmith.Common.IElement): any{
            var viewDescriptor = data[1];
            var viewFactory:IViewFactory = JohnSmith.Common.JS.ioc.resolve("viewFactory");

            try {
                viewFactory.resolve(viewDescriptor, null);
                data[0].view = viewDescriptor;
            } catch(Error) {
            }

            return data;
        }
    });

    JohnSmith.Common.JS.createView = function(viewDescriptor: any, viewModel:any):JohnSmith.Views.IView{
        var viewFactory = JohnSmith.Common.JS.ioc.resolve("viewFactory");
        return viewFactory.resolve(viewDescriptor, viewModel);
    };
}
