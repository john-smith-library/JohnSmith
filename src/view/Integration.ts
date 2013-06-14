/// <reference path="../Common.ts"/>
/// <reference path="../binding/Contracts.ts"/>
/// <reference path="../binding/Handling.ts"/>
/// <reference path="../binding/BindableManager.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="DefaultViewFactory.ts"/>

module JohnSmith.View {
    export class ViewArgumentProcessor implements Binding.IHandlerArgumentProcessor {
        private _viewFactory: IViewFactory;

        constructor(viewFactory: IViewFactory){
            this._viewFactory = viewFactory;
        }

        public canProcess(
            argument:any,
            argumentIndex: number,
            options: any,
            bindable:Binding.IBindable,
            context:JohnSmith.Common.IElement) : bool{
            return argumentIndex === 1 && (!options.view)
        }

        public process(
            argument:any,
            options: any,
            bindable:Binding.IBindable,
            context:JohnSmith.Common.IElement){

            try {
                var viewFactory = this._viewFactory;
                viewFactory.resolve(argument, null);
                options.view = argument;
//                options.renderer = new ViewValueRenderer(function(viewModel){
//                    return viewFactory.resolve(argument, viewModel);
//                });
            } catch(Error) {
            }
        }
    }

    export class ViewValueRenderer implements Binding.IValueRenderer {
        private _viewFactory: IViewFactory;
        private _viewDescriptor: IViewFactory;
        private currentView: IView;

        constructor(viewFactory: IViewFactory, viewDescriptor: IViewFactory){
            this._viewFactory = viewFactory;
            this._viewDescriptor = viewDescriptor;
        }

        public render(value: any, destination: JohnSmith.Common.IElement): JohnSmith.Common.IElement {
            if (this.currentView){
                this.currentView.dispose();
            }

            this.currentView = this._viewFactory.resolve(this._viewDescriptor, value);
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

    JohnSmith.Common.JS.ioc.registerWithDependencies(
        "viewFactory",
        function(bindableManager: Binding.IBindableManager,
                 elementFactory: Common.IElementFactory,
                 markupResolver: Common.IMarkupResolver){
            return new DefaultViewFactory(bindableManager, elementFactory, JohnSmith.Common.JS.event.bus, markupResolver);
        },
        "bindingManager",
        "elementFactory",
        "markupResolver"
    )

    JohnSmith.Common.JS.ioc.withRegistered(
        "viewFactory",
        function(viewFactory:IViewFactory){
            JohnSmith.Common.JS.addHandlerArgumentProcessor(new ViewArgumentProcessor(viewFactory));
        });

    JohnSmith.Common.JS.createView = function(viewDescriptor: any, viewModel:any): View.IView{
        var viewFactory = JohnSmith.Common.JS.ioc.resolve("viewFactory");
        return viewFactory.resolve(viewDescriptor, viewModel);
    };
}