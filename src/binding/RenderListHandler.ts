/// <reference path="../Fetchers.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>
/// <reference path="RenderValueHandler.ts"/>

module JohnSmith.Binding {
    export class MarkSelectedHandler implements IBindableHandler, IBindableListener {
        private _listBindable: IBindable;
        private _contentDestination: JohnSmith.Common.IElement;
        private _valueRenderer: IValueRenderer;
        private _mapper:IValueToElementMapper;

        constructor(
            listBindable: IBindable,
            contentDestination: JohnSmith.Common.IElement,
            valueRenderer: IValueRenderer,
            mapper:IValueToElementMapper){
            this._listBindable = listBindable;
            this._contentDestination = contentDestination;
            this._valueRenderer = valueRenderer;
            this._mapper = mapper;
        }

        public wireWith(bindable: IBindable) {
            this.doRender(bindable.getValue(), DataChangeReason.replace)
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
            this.doRender(newValue, changeType);
        }

        public stateChanged(oldState: string, newState: string) {
        }

        public dispose(): void {
        }

        private doRender(value: any, reason:DataChangeReason):void {
            var items:Array = this._listBindable.getValue();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var element = this._mapper.getElementFor(item, this._contentDestination);
                if (item == value) {
                    element.addClass("selected");
                } else {
                    element.removeClass("selected");
                }
            }
        }
    }

    export class RenderListHandler implements IBindableHandler, IBindableListener {
        private _contentDestination: JohnSmith.Common.IElement;
        private _valueRenderer: IValueRenderer;
        private _mapper:IValueToElementMapper;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer,
            mapper:IValueToElementMapper,
            selectionOptions:SelectionOptions) {

            this._contentDestination = contentDestination;
            this._valueRenderer = renderer;
            this._mapper = mapper;
        }

        public wireWith(bindable: IBindable) {
            this.doRender(bindable.getValue(), DataChangeReason.replace)
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
            this.doRender(newValue, changeType);
        }

        public stateChanged(oldState: string, newState: string) {
        }

        public dispose(): void {
            if (this._valueRenderer.dispose) {
                this._valueRenderer.dispose();
            }
        }

        private doRender(value: any, reason:DataChangeReason):void {
            var items:Array = value;

            if (reason == DataChangeReason.remove){
                for (var i = 0; i < items.length; i++){
                    var item = items[i];
                    var itemElement = this._mapper.getElementFor(item, this._contentDestination);
                    if (itemElement) {
                        itemElement.remove();
                    }
                }
            } else if (reason == DataChangeReason.add) {
                this.appendItems(value);
            } else {
                this._contentDestination.empty();
                this.appendItems(value);
            }
        }

        private appendItems(items:Array):void {
            if (!items) {
                return;
            }

            for (var i = 0; i < items.length; i++){
                var item = items[i];
                var itemElement = this._valueRenderer.render(item, this._contentDestination);

                this._mapper.attachValueToElement(item, itemElement);
            }
        }
    }

    export class RenderListFactory extends RenderHandlerFactoryBase implements IHandlerFactory {
        private _mapper: IValueToElementMapper;

        constructor(
            destinationFactory: Common.IElementFactory,
            markupResolver: Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            mapper: IValueToElementMapper,
            fetcherFactory: Fetchers.IFetcherFactory){

            super(destinationFactory, markupResolver, viewFactory, fetcherFactory);
            this._mapper = mapper;
        }

        public createHandler(handlerData: any, bindable:IBindable, context: Common.IElement, commandHost:Command.ICommandHost): IBindableHandler {
            if (!handlerData) {
                return null;
            }

            var options: RenderListOptions = handlerData;
            if (options.handler && options.handler !== "render"){
                return null;
            }

            if (options.type && options.type !== "list") {
                return null;
            }

            if (!options.type) {
                if (!this.isList(bindable)) {
                    return null;
                }
            }

            this.fillContentDestination(options, context);
            this.fillRenderer(options, commandHost, bindable);

            if (!options.mapper) {
                options.mapper = this._mapper;
            }

            if (options.selectedItem){
                options.selectable = true;

                if (!options.setSelection){
                    options.setSelection = function(value: any){
                        options.selectedItem.setValue(value);
                    }
                }
            }

            var isSelectable = options.selectable || false;
            var selectionOptions:SelectionOptions = {
                isSelectable: isSelectable,
                selectedItem: options.selectedItem,
                setSelectedCallback: options.setSelection
            };

            var handler = new RenderListHandler(
                options.contentDestination,
                options.renderer,
                options.mapper,
                selectionOptions);

            return handler;
        }
    }

    JohnSmith.Common.JS.ioc.withRegistered(
        function(
            destinationFactory:Common.IElementFactory,
            markupResolver:Common.IMarkupResolver,
            mapper:IValueToElementMapper,
            viewFactory: View.IViewFactory,
            fetcherFactory: Fetchers.IFetcherFactory){
            JohnSmith.Common.JS.addHandlerFactory(new RenderListFactory(destinationFactory, markupResolver, viewFactory, mapper, fetcherFactory));
        },
        "elementFactory",
        "markupResolver",
        "valueToElementMapper",
        "viewFactory",
        "fetcherFactory");
}