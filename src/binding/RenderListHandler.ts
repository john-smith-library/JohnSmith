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
        private _renderedValues: IRenderedValueData[];

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer) {

            this._contentDestination = contentDestination;
            this._valueRenderer = renderer;
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

        private removeRenderedValue(renderedValue: IRenderedValue):void {
            var indexToRemove = -1;
            for (var i = 0; i < this._renderedValues.length; i++){
                if (this._renderedValues[i].renderedValue === renderedValue){
                    indexToRemove = i;
                }
            }

            if (indexToRemove >=0) {
                this._renderedValues.splice(indexToRemove, 1);
            }
        }

        private doRender(value: any, reason:DataChangeReason):void {
            var items:Array = value;

            if (reason == DataChangeReason.remove){
                for (var i = 0; i < items.length; i++){
                    var item = items[i];
                    var itemRenderedValue = this.findRenderedValue(item);
                    if (itemRenderedValue) {
                        if (itemRenderedValue.dispose) {
                            itemRenderedValue.dispose();
                        }

                        itemRenderedValue.element.remove();
                        this.removeRenderedValue(itemRenderedValue);
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
            }
        }
    }

    export class RenderListFactory extends RenderHandlerFactoryBase implements IHandlerFactory {
        constructor(
            destinationFactory: Common.IElementFactory,
            markupResolver: Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            fetcherFactory: Fetchers.IFetcherFactory){

            super(destinationFactory, markupResolver, viewFactory, fetcherFactory);
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

            var handler = new RenderListHandler(
                options.contentDestination,
                options.renderer);

            return handler;
        }
    }

    JohnSmith.Common.JS.ioc.withRegistered(
        function(
            destinationFactory:Common.IElementFactory,
            markupResolver:Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            fetcherFactory: Fetchers.IFetcherFactory){
            JohnSmith.Common.JS.addHandlerFactory(new RenderListFactory(destinationFactory, markupResolver, viewFactory, fetcherFactory));
        },
        "elementFactory",
        "markupResolver",
        //"valueToElementMapper",
        "viewFactory",
        "fetcherFactory");
}