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
            if (value) {
                this.valueRenderer.render(value, this.contentDestination)
            };
        }
    }

    export interface RenderHandlerOptions extends HandlerOptions {
        contentDestination?: JohnSmith.Common.IElement;
        renderer?: IValueRenderer;
        type?: string;
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

            //return data && data.length > 0 && data[0].handler === "render" && (!data[0].formatter) && (!data[0].renderer);
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            data[0].formatter =  {
                format: function (value: any): string {
                    if (value == null){
                        return null;
                    }

                    return value.toString();
                }
            }

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
            //return data && data.length > 0 && data[0].handler === "render" && data[0].formatter && (!data[0].renderer);
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            // get formatter from input array
            var formatter = <JohnSmith.Binding.IValueFormatter> data[0].formatter;

            // put renderer to input array
            data[0].renderer =  {
                render: function(value: any, destination: JohnSmith.Common.IElement) : JohnSmith.Common.IElement {
                    var formattedValue = formatter.format(value);
                    var result = destination.append(formattedValue);

                    JohnSmith.Common.JS.event.bus.trigger(
                        "valueRendered",
                        {
                            originalValue: value,
                            formattedValue: formattedValue,
                            root: result,
                            destination: destination
                        });

                    return  result;
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