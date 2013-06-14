/// <reference path="../Common.ts"/>
/// <reference path="../view/Integration.ts"/>
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

    /**
     * A base class for rendering-related handlers.
     * Contains a few handy util methods.
     */
    export class RenderHandlerFactoryBase {
        private _destinationFactory: Common.IElementFactory;
        private _markupResolver: Common.IMarkupResolver;
        private _viewFactory: View.IViewFactory;

        constructor(destinationFactory: Common.IElementFactory, markupResolver: Common.IMarkupResolver, viewFactory: View.IViewFactory){
            this._destinationFactory = destinationFactory;
            this._markupResolver = markupResolver;
            this._viewFactory = viewFactory;
        }

        public fillContentDestination(options:RenderHandlerOptions, context:Common.IElement){
            if (!options.contentDestination) {
                options.contentDestination = context == null ?
                    this._destinationFactory.createElement(options.to) :
                    context.findRelative(options.to);
            }
        }

        public fillRenderer(options:RenderHandlerOptions){
            if (!options.renderer) {
                /** try to resolve view first */
                if (options.view) {
                    options.renderer = new View.ViewValueRenderer(this._viewFactory, options.view);
                } else {
                    /** use default renderer if no view in options */
                    if (!options.formatter) {
                        var encode = true;
                        if (options.encode !== undefined){
                            encode = options.encode;
                        }

                        var defaultValueType = encode ? Common.ValueType.text : Common.ValueType.html;
                        options.formatter =  new DefaultFormatter(defaultValueType);
                    }

                    options.renderer = new FormatterBasedRenderer(options.formatter, this._markupResolver);
                }
            }
        }

        /**
         * Checks id the bindable stores an array.
         */
        public isList(bindable:IBindable):bool {
            if (bindable instanceof BindableList){
                return true;
            } else if (bindable){
                var value = bindable.getValue();
                if (value instanceof Array){
                    return true;
                }
            }

            return false;
        }
    }

    export class RenderValueFactory extends RenderHandlerFactoryBase implements IHandlerFactory {
        constructor(destinationFactory: Common.IElementFactory, markupResolver: Common.IMarkupResolver, viewFactory: View.IViewFactory){
            super(destinationFactory, markupResolver, viewFactory);
        }

        public createHandler(handlerData: any, bindable:IBindable, context: Common.IElement): IBindableHandler {
            if (!handlerData) {
                return null;
            }

            var options: RenderHandlerOptions = handlerData;
            if (options.handler && options.handler !== "render"){
                return null;
            }

            if (options.type && options.type !== "value") {
                return null;
            }

            if (!options.type) {
                if (this.isList(bindable)) {
                    return null;
                }
            }

            this.fillContentDestination(options, context);
            this.fillRenderer(options);

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

    JohnSmith.Common.JS.ioc.withRegistered(
        "elementFactory",
        "markupResolver",
        "viewFactory",
        function(destinationFactory:Common.IElementFactory, markupResolver:Common.IMarkupResolver, viewFactory: View.IViewFactory){
            JohnSmith.Common.JS.addHandlerFactory(new RenderValueFactory(destinationFactory, markupResolver, viewFactory));
        }
    );

    class FormatterBasedRenderer implements IValueRenderer {
        private _formatter: IValueFormatter;
        private _markupResolver: Common.IMarkupResolver;

        constructor(formatter: IValueFormatter, markupResolver: Common.IMarkupResolver){
            this._formatter = formatter;
            this._markupResolver = markupResolver;
        }

        public render(value: any, destination: JohnSmith.Common.IElement): Common.IElement {
            var formattedValue = this._formatter.format(value);
            if (formattedValue.type === Common.ValueType.text) {
                return destination.appendText(formattedValue.value);
            } else if (formattedValue.type === Common.ValueType.html) {
                return destination.appendHtml(formattedValue.value);
            } else if (formattedValue.type === Common.ValueType.unknown) {
                var markup = this._markupResolver.resolve(formattedValue.value);
                return destination.appendHtml(markup);
            } else {
                throw new Error("Unknown value type: " + formattedValue.type);
            }
        }
    }
}