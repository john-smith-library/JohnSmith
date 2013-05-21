/// <reference path="Common.ts"/>
/// <reference path="binding/Contracts.ts"/>
/// <reference path="binding/BindableManager.ts"/>
/// <reference path="binding/Handling.ts"/>

module JohnSmith.Views {
    export interface IViewModel {
        resetState?: () => void;
    }

    export interface IView extends JohnSmith.Common.IDisposable {
        renderTo: (destination:any) => void;
        getRootElement: () => JohnSmith.Common.IElement;
    }

    interface IChildView {
        child: IView;
        destination: any;
    }

    export class DefaultView implements IView {
        private children:IChildView[];
        private rootElement: JohnSmith.Common.IElement;
        private eventBus:JohnSmith.Common.IEventBus;
        private viewModel:IViewModel;
        private elementFactory:JohnSmith.Common.IElementFactory;
        private bindableManager:JohnSmith.Binding.IBindableManager;
        private templateQuery:string;
        private initCallback: (view:IView, viewModel:any) => void;

        constructor (
            bindableManager:JohnSmith.Binding.IBindableManager,
            elementFactory:JohnSmith.Common.IElementFactory,
            templateQuery:string,
            initCallback: (view:IView, viewModel:any) => void,
            viewModel:IViewModel,
            eventBus:JohnSmith.Common.IEventBus){

            this.bindableManager = bindableManager;
            this.elementFactory = elementFactory;
            this.templateQuery = templateQuery;
            this.initCallback = initCallback;
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
            var templateElement = this.elementFactory.createElement(this.templateQuery);

            if (templateElement.isEmpty()){
                throw new Error("Template [" + this.templateQuery + "] content is empty");
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

            if (this.initCallback){
                this.initCallback(this, this.viewModel);
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

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{view: Function} => {renderer: IValueRenderer} [Sets renderer for view]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0){
                if (data[0].handler === "render" && data[0].view) {
                    return JohnSmith.Binding.TransformerApplicability.Applicable;
                }
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], context: JohnSmith.Common.IElement): any{
            data[0].renderer = new ViewValueRenderer(data[0].view)
            return data;
        }
    });

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "[{}, function(){}] => {view: function(){}} [Converts second argument to view property]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0){
                if (data[0].view) {
                    return JohnSmith.Binding.TransformerApplicability.NotApplicable;
                }

                if (typeof data[0] === "object" && data.length > 1 && data[1].constructor && data[1].apply && data[1].call) {
                    return JohnSmith.Binding.TransformerApplicability.Applicable;
                }
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], context: JohnSmith.Common.IElement): any{
            data[0].view = data[1];
            return data;
        }
    });

    JohnSmith.Common.JS.createView = function(templateQuery:string, initCallback: (view:IView, viewModel:IViewModel) => void, viewModel:any):IView{
        return new DefaultView(
            <JohnSmith.Binding.IBindableManager> JohnSmith.Common.JS.ioc.resolve("bindingManager"),
            <JohnSmith.Common.IElementFactory> JohnSmith.Common.JS.ioc.resolve("elementFactory"),
            templateQuery,
            initCallback,
            viewModel,
            JohnSmith.Common.JS.event.bus
        )
    }
}
