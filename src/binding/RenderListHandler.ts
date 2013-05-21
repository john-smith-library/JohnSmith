/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>
/// <reference path="RenderValueHandler.ts"/>

module JohnSmith.Binding {
    export interface IValueToElementMapper {
        getElementFor(value:any, root:JohnSmith.Common.IElement):JohnSmith.Common.IElement;
        attachValueToElement(value:any, element:JohnSmith.Common.IElement);
    }

    export interface RenderListOptions extends RenderHandlerOptions {
        mapper?: IValueToElementMapper;
    }

    export class RenderListHandler implements IBindableHandler, IBindableListener {
        private contentDestination: JohnSmith.Common.IElement;
        private valueRenderer: IValueRenderer;
        private mapper:IValueToElementMapper;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer,
            mapper:IValueToElementMapper) {

            this.contentDestination = contentDestination;
            this.valueRenderer = renderer;
            this.mapper = mapper;
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
            if (this.valueRenderer.dispose) {
                this.valueRenderer.dispose();
            }
        }

        private doRender(value: any, reason:DataChangeReason):void {
            if (!value){
                return;
            }

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
            for (var i = 0; i < items.length; i++){
                var item = items[i];
                var itemElement = this.valueRenderer.render(item, this.contentDestination);
                this.mapper.attachValueToElement(item, itemElement);
            }
        }
    }

    export class RenderListFactory implements IHandlerFactory {
        public createHandler(handlerData: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (!handlerData) {
                return null;
            }

            var options: RenderListOptions = handlerData;
            var validOptions = options.handler === "render" && options.type === "list";
            if (!validOptions) {
                return null;
            }

            if (!options.contentDestination) {
                throw new Error("Required option 'contentDestination' is not set!");
            }

            if (!options.renderer) {
                throw new Error("Required option 'renderer' is not set!")
            }

            if (!options.mapper) {
                throw new Error("Required option 'mapper' is not set!")
            }

            var handler = new RenderListHandler(
                options.contentDestination,
                options.renderer,
                options.mapper);

            return handler;
        }
    }

    JohnSmith.Common.JS.addHandlerFactory(new RenderListFactory());

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{handler: 'render'} => {handler: 'render', type: 'list'} [Sets type to 'list']",

        checkApplicability: function(data:any[], bindable:IBindable, context:JohnSmith.Common.IElement): TransformerApplicability{
            if (data && data.length > 0 && data[0].handler === "render"){
                if (data[0].type) {
                    return TransformerApplicability.NotApplicable;
                }

                if (bindable instanceof BindableList){
                    return TransformerApplicability.Applicable;
                } else if (bindable){
                    var value = bindable.getValue();
                    if (value instanceof Array){
                        return TransformerApplicability.Applicable;
                    }
                }

                return TransformerApplicability.NotApplicable;
            }

            return TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            data[0].type = 'list';
            return data;
        }
    });
}