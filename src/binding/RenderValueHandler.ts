/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>
/// <reference path="BindableManager.ts"/>
/// <reference path="BindableList.ts"/>

module JohnSmith.Binding {
    export class RenderValueHandler implements IBindableHandler, IBindableListener {
        private contentDestination: JohnSmith.Common.IElement;
        private valueRenderer: IValueRenderer;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer) {

            this.contentDestination = contentDestination;
            this.valueRenderer = renderer;
        }

        public wireWith(bindable: IBindable) {
            this.doRender(bindable.getValue())
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
            this.doRender(newValue);
        }

        public stateChanged(oldState: string, newState: string) {
        }

        public dispose(): void {
            if (this.valueRenderer.dispose) {
                this.valueRenderer.dispose();
            }
        }

        private doRender(value: any):void {
            this.contentDestination.empty();
            if (value !== null && value !== undefined) {
                this.valueRenderer.render(value, this.contentDestination);
            }
        }
    }

    export class RenderValueFactory implements IHandlerFactory {
        public createHandler(handlerData: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (!handlerData) {
                return null;
            }

            var options: RenderHandlerOptions = handlerData;
            var validOptions = options.handler === "render" && options.type === "value";
            if (!validOptions) {
                return null;
            }

            if (!options.contentDestination) {
                throw new Error("Required option 'contentDestination' is not set!");
            }

            if (!options.renderer) {
                throw new Error("Required option 'renderer' is not set!")
            }

            var handler = new RenderValueHandler(
                options.contentDestination,
                options.renderer);

            return handler;
        }
    }

    export class FormElementValueRenderer implements IValueRenderer {
        public render(value: any, destination: JohnSmith.Common.IElement) : JohnSmith.Common.IElement {
            var currentValue = destination.getValue();
            if (currentValue !== value){
                destination.setValue(value);
            }

            return destination;
        }
    }

    export class DefaultFormatter implements IValueFormatter {
        private _defaultValueType: string;

        constructor(defaultValueType: string){
            this._defaultValueType = defaultValueType;
        }

        public format(value: any): IFormattedValue {
            return {
                value: value.toString(),
                type: this._defaultValueType
            };
        }
    }

    JohnSmith.Common.JS.addHandlerFactory(new RenderValueFactory());

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{} => {handler: 'render'} [Sets handler to 'render' if it is not set]",

        checkApplicability: function(data:any[], bindable:IBindable, context:JohnSmith.Common.IElement): TransformerApplicability{
            if (data && data.length > 0) {
                if (data[0].handler) {
                    return TransformerApplicability.NotApplicable;
                }

                if (typeof data[0] === "object") {
                    return TransformerApplicability.Applicable;
                }
            }

            return TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            data[0].handler = "render";
            return data;
        }
    });

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{handler: 'render'} => {handler: 'render', type: 'value'} [Sets type to 'value']",

        checkApplicability: function(data:any[], bindable:IBindable, context:JohnSmith.Common.IElement): TransformerApplicability{
            if (data && data.length > 0 && data[0].handler === "render"){
                if (data[0].type) {
                    return TransformerApplicability.NotApplicable;
                }

                if (bindable instanceof BindableList){
                    return TransformerApplicability.NotApplicable;
                } else if (bindable){
                    var value = bindable.getValue();
                    if (value instanceof Array){
                        return TransformerApplicability.NotApplicable;
                    }
                }

                return TransformerApplicability.Applicable;
            }

            return TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            data[0].type = 'value';
            return data;
        }
    });

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{handler: 'render'} => {formatter: IValueFormatter} [Sets default formatter]",

        checkApplicability: function(data:any[], bindable:IBindable, context:JohnSmith.Common.IElement): TransformerApplicability {
            if (data && data.length > 0){
                if (data[0].renderer || data[0].formatter) {
                    return TransformerApplicability.NotApplicable;
                }

                if (data[0].handler === "render"){
                    return TransformerApplicability.Applicable;
                }
            }

            return TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            var encode = true;
            if (data[0].encode !== undefined){
                encode = data[0].encode;
            }

            var defaultValueType = encode ? Common.ValueType.text : Common.ValueType.html;
            data[0].formatter =  new DefaultFormatter(defaultValueType);
            return data;
        }
    });

    /** Adds renderer resolver */
    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{formatter: IValueFormatter} => {renderer: IValueRenderer} [Converts value formatter to value renderer]",

        checkApplicability: function(data:any[], bindable:IBindable, context:JohnSmith.Common.IElement): TransformerApplicability {
            if (data && data.length > 0){
                if (data[0].renderer) {
                    return TransformerApplicability.NotApplicable;
                }

                if (data[0].handler === "render" && data[0].formatter){
                    return TransformerApplicability.Applicable;
                }
            }

            return TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:IBindable, context: Common.IElement): any{
            // get formatter from input array
            var formatter = <Binding.IValueFormatter> data[0].formatter;

            // put renderer to input array
            data[0].renderer =  {
                render: function(value: any, destination: JohnSmith.Common.IElement) : Common.IElement {
                    var formattedValue = formatter.format(value);
                    var result:Common.IElement = null;
                    if (formattedValue.type === Common.ValueType.text) {
                        result = destination.appendText(formattedValue.value);
                    } else if (formattedValue.type === Common.ValueType.html) {
                        result = destination.appendHtml(formattedValue.value);
                    } else if (formattedValue.type === Common.ValueType.unknown) {
                        var markup = Common.JS.ioc.resolve("markupResolver").resolve(formattedValue.value);
                        result = destination.appendHtml(markup);
                    } else {
                        throw new Error("Unknown value type: " + formattedValue.type);
                    }

                    JohnSmith.Common.JS.event.bus.trigger(
                        "valueRendered",
                        {
                            originalValue: value,
                            formattedValue: formattedValue,
                            root: destination,
                            destination: destination
                        });

                    return result;
                }
            }

            // if formatter could be disposed, add dispose method to renderer
            if (formatter.dispose) {
                data[0].renderer.dispose = function(){
                    formatter.dispose;
                }
            }

            return data;
        }
    });
}