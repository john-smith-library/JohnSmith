/// <reference path="../Fetchers.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>
/// <reference path="RenderValueHandler.ts"/>

module JohnSmith.Binding {
    export interface IRenderedValueData {
        value: any;
        renderedValue: IRenderedValue;
    }

    export class RenderListHandler implements IBindableHandler, IBindableListener {
        private _contentDestination: JohnSmith.Common.IElement;
        private _valueRenderer: IValueRenderer;
        //private _mapper:IValueToElementMapper;
        private _renderedValues: IRenderedValueData[];

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer,
            mapper:IValueToElementMapper,
            selectionOptions:SelectionOptions) {

            this._contentDestination = contentDestination;
            this._valueRenderer = renderer;
            //this._mapper = mapper;
            this._renderedValues = [];
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
            for (var i = 0; i < this._renderedValues.length; i++){
                if (this._renderedValues[i].renderedValue.dispose){
                    this._renderedValues[i].renderedValue.dispose();
                }
            }
        }

        private findRenderedValue(value: any) :IRenderedValue{
            for (var i = 0; i < this._renderedValues.length; i++){
                if (this._renderedValues[i].value === value){
                    return this._renderedValues[i].renderedValue;
                }
            }

            return null;
        }

        private doRender(value: any, reason:DataChangeReason):void {
            var items:Array = value;

            if (reason == DataChangeReason.remove){
                for (var i = 0; i < items.length; i++){
                    var item = items[i];
                    var itemRenderedValue = this.findRenderedValue(item);
                        //this._mapper.getElementFor(item, this._contentDestination);
                    if (itemRenderedValue) {
                        if (itemRenderedValue.dispose) {
                            itemRenderedValue.dispose();
                        }

                        itemRenderedValue.element.remove();
                    }
                }
            } else if (reason == DataChangeReason.add) {
                this.appendItems(value);
            } else {
                this._renderedValues = [];
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
                var itemRenderedValue = this._valueRenderer.render(item, this._contentDestination);
                this._renderedValues.push({
                    value: item,
                    renderedValue: itemRenderedValue
                });
                //this._mapper.attachValueToElement(item, itemRenderedValue.element);
                //this._renderedValues.push(itemRenderedValue);
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