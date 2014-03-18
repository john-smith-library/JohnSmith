/// <reference path="../Common.ts"/>
/// <reference path="../Fetchers.ts"/>
/// <reference path="../view/Integration.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>
/// <reference path="Renderers.ts"/>
/// <reference path="BindableManager.ts"/>
/// <reference path="BindableList.ts"/>

module JohnSmith.Binding {
    export class RenderValueHandler implements IBindableHandler, IBindableListener {
        private _contentDestination: JohnSmith.Common.IElement;
        private _valueRenderer: IValueRenderer;
        private _currentValue: IRenderedValue;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer) {

            this._contentDestination = contentDestination;
            this._valueRenderer = renderer;
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

        public dispose(): void {
            this.disposeCurrentValue();
        }

        private doRender(value: any):void {
            this.disposeCurrentValue();

            if (value !== null && value !== undefined) {
                this._currentValue = this._valueRenderer.render(value, this._contentDestination);
            }
            /*else {
                this._contentDestination.empty();
            }*/
        }

        private disposeCurrentValue(){
            if (this._currentValue) {
                this._currentValue.dispose();
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
        private _fetcherFactory: Fetchers.IFetcherFactory;

        constructor(destinationFactory: Common.IElementFactory, markupResolver: Common.IMarkupResolver, viewFactory: View.IViewFactory, fetcherFactory: Fetchers.IFetcherFactory){
            this._destinationFactory = destinationFactory;
            this._markupResolver = markupResolver;
            this._viewFactory = viewFactory;
            this._fetcherFactory = fetcherFactory;
        }

        public fillContentDestination(options:RenderHandlerOptions, context:Common.IElement){
            if (!options.contentDestination) {
                options.contentDestination = context == null ?
                    this._destinationFactory.createElement(options.to) :
                    context.findRelative(options.to);
            }
        }

        public fillRenderer(options:RenderHandlerOptions, commandHost:Command.ICommandHost, bindable:IBindable){
            if (!options.renderer) {
                /** try to resolve view first */
                if (options.view) {
                    options.renderer = new View.ViewValueRenderer(this._viewFactory, options.view);
                } else {
                    /** use default renderer if no view in options */
                    if (!options.valueType) {
                        var encode = true;
                        if (options.encode !== undefined){
                            encode = options.encode;
                        }

                        options.valueType = encode ? Common.ValueType.text : Common.ValueType.html;
                    }

                    if (!options.formatter) {
                        options.formatter =  new DefaultFormatter();
                    }

                    options.renderer = this.getRenderer(options, commandHost, bindable);
                }
            }
        }

        private getRenderer(options:RenderHandlerOptions, commandHost:Command.ICommandHost, bindable:IBindable) : IValueRenderer{
            var fetcher:Fetchers.IFetcher = null;

            if (options.fetch) {
                fetcher = this._fetcherFactory.getByKey(options.fetch);
                if (!fetcher) {
                    throw new Error("Fetcher " + options.fetch + " not found");
                }
            } else {
                fetcher = this._fetcherFactory.getForElement(options.contentDestination);
            }

            if (fetcher) {
                if (options.bidirectional !== false){
                    var command = options.command;
                    var context = options.commandContext;
                    var event = options.event || "change";

                    var bindableObject: IChangeable = <IChangeable> bindable;
                    if((!command) && bindableObject.setValue) {
                        command = bindableObject.setValue;
                        context = bindableObject;
                    }

                    if (command) {
                        commandHost.on(options.to, event).react(command, context);
                    }
                }

                return new FetcherToRendererAdapter(fetcher);
            }

            switch (options.valueType) {
                case Common.ValueType.text:
                    return new TextRenderer(options.formatter);
                case Common.ValueType.html:
                    return new HtmlRenderer(options.formatter);
                case Common.ValueType.unknown:
                    return new ResolvableMarkupRenderer(options.formatter, this._markupResolver);
                default:
                    throw new Error("Unknown value type: " + options.valueType);
            }
        }

        /**
         * Checks id the bindable stores an array.
         */
        public isList(bindable:IBindable):boolean {
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
        constructor(
            destinationFactory: Common.IElementFactory,
            markupResolver: Common.IMarkupResolver,
            viewFactory: View.IViewFactory,
            fetcherFactory: Fetchers.IFetcherFactory) {

            super(destinationFactory, markupResolver, viewFactory, fetcherFactory);
        }

        public createHandler(handlerData: any, bindable:IBindable, context: Common.IElement, commandHost:Command.ICommandHost): IBindableHandler {
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
            this.fillRenderer(options, commandHost, bindable);

            var handler = new RenderValueHandler(
                options.contentDestination,
                options.renderer);

            return handler;
        }
    }

    export class DefaultFormatter implements IValueFormatter {
        public format(value: any): string {
            return value.toString();
        }
    }


}