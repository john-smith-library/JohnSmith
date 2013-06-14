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
        private contentDestination: JohnSmith.Common.IElement;
        private valueRenderer: IValueRenderer;
        private mapper:IValueToElementMapper;
        private selectionOptions:SelectionOptions;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer,
            mapper:IValueToElementMapper,
            selectionOptions:SelectionOptions) {

            this.contentDestination = contentDestination;
            this.valueRenderer = renderer;
            this.mapper = mapper;
            this.selectionOptions = selectionOptions;
        }

        public wireWith(bindable: IBindable) {
            this.doRender(bindable.getValue(), DataChangeReason.replace)
            bindable.addListener(this);

            if (this.selectionOptions && this.selectionOptions.isSelectable) {
                if (!this.selectionOptions.selectedItem){
                    this.selectionOptions.selectedItem =  (<BindableList> bindable).selectedItem();
                }

                if (!this.selectionOptions.setSelectedCallback){
                    var handler = this;

                    this.selectionOptions.setSelectedCallback = function(selectedItem: any){
                        (<BindableValue> handler.selectionOptions.selectedItem).setValue(selectedItem);
                    }
                }

                new MarkSelectedHandler(
                    bindable,
                    this.contentDestination,
                    this.valueRenderer,
                    this.mapper
                ).wireWith(this.selectionOptions.selectedItem);
            }
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
            if (this.valueRenderer.dispose) {
                this.valueRenderer.dispose();
            }
        }

        private doRender(value: any, reason:DataChangeReason):void {
            var items:Array = value;

            if (reason == DataChangeReason.remove){
                for (var i = 0; i < items.length; i++){
                    var item = items[i];
                    var itemElement = this.mapper.getElementFor(item, this.contentDestination);
                    if (itemElement) {
                        itemElement.remove();
                    }
                }
            } else if (reason == DataChangeReason.add) {
                this.appendItems(value);
            } else {
                this.contentDestination.empty();
                this.appendItems(value);
            }
        }

        private appendItems(items:Array):void {
            if (!items) {
                return;
            }

            for (var i = 0; i < items.length; i++){
                var item = items[i];
                var itemElement = this.valueRenderer.render(item, this.contentDestination);

                if (this.selectionOptions && this.selectionOptions.isSelectable) {
                    /** Fucking closure */
                    var callback = (function(handler: RenderListHandler, value: any){
                        return function(){
                            handler.selectionOptions.setSelectedCallback(value);
                        }
                    })(this, item);

                    itemElement.attachClickHandler(callback);
                }

                this.mapper.attachValueToElement(item, itemElement);
            }
        }
    }

    export class RenderListFactory extends RenderHandlerFactoryBase implements IHandlerFactory {
        private _mapper: IValueToElementMapper;

        constructor(
            destinationFactory: Common.IElementFactory,
            markupResolver: Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            mapper: IValueToElementMapper){

            super(destinationFactory, markupResolver, viewFactory);
            this._mapper = mapper;
        }

        public createHandler(handlerData: any, bindable:IBindable, context: Common.IElement): IBindableHandler {
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
            this.fillRenderer(options);

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
        "elementFactory",
        "markupResolver",
        "valueToElementMapper",
        "viewFactory",
        function(
            destinationFactory:Common.IElementFactory,
            markupResolver:Common.IMarkupResolver,
            mapper:IValueToElementMapper,
            viewFactory: View.IViewFactory){
            JohnSmith.Common.JS.addHandlerFactory(new RenderListFactory(destinationFactory, markupResolver, viewFactory, mapper));
        }
    );
}