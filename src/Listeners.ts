export class RenderValueListener<T> implements IManageable {
    private _currentValue: IRenderedValue;
    private _link: IDisposable;

    constructor(private _observable:IObservable<T>, private _contentDestination: IElement, private _renderer:IValueRenderer) {
    }

    public init(): void {
        this.doRender(this._observable.getValue());
        this._observable.listen((value: T) => this.doRender(value));
    }

    public dispose(): void {
        if (this._link) {
            this._link.dispose();
        }

        this.disposeCurrentValue();
    }

    private doRender(value: T):void {
        this.disposeCurrentValue();

        if (value !== null && value !== undefined) {
            this._currentValue = this._renderer.render(value, this._contentDestination);
        }
    }

    private disposeCurrentValue(){
        if (this._currentValue) {
            this._currentValue.dispose();
        }
    }
}

export class RenderListenerFactory {
    constructor(
        private _defaultFormatter: IValueFormatter,
        private _markupResolver: IMarkupResolver,
        private _viewFactory: IViewFactory){}

    public createListener(observable:IObservable<Object>, root:IElement, options: ListenerOptions): IManageable {
        if (!options) {
            options = {};
        }

        if (!options.renderer) {
            /** try to resolve view first */
            if (options.view) {
                options.renderer = new ViewValueRenderer(this._viewFactory, options.view);
            } else {
                /** use default renderer if no view in options */
                if (!options.valueType) {
                    if (options.formatter) {
                        /** if custom formatter used we assume that formatted value might be of unknown type */
                        options.valueType = ValueType.unknown;
                    } else {
                        var encode = true;
                        if (options.encode !== undefined){
                            encode = options.encode;
                        }

                        options.valueType = encode ? ValueType.text : ValueType.html;
                    }
                }

                if (!options.formatter) {
                    options.formatter = this._defaultFormatter;
                }

                options.renderer = this.getRenderer(options /*, commandHost, bindable*/);
            }
        }

        return new RenderValueListener(observable, root, options.renderer);
    }

    private getRenderer(options:ListenerOptions /*, commandHost:Command.ICommandHost, bindable:IBindable*/) : IValueRenderer{
//        var fetcher:Fetchers.IFetcher = null;
//
//        if (options.fetch) {
//            fetcher = this._fetcherFactory.getByKey(options.fetch);
//            if (!fetcher) {
//                throw new Error("Fetcher " + options.fetch + " not found");
//            }
//        } else {
//            fetcher = this._fetcherFactory.getForElement(options.contentDestination);
//        }
//
//        if (fetcher) {
//            if (options.bidirectional !== false){
//                var command = options.command;
//                var context = options.commandContext;
//                var event = options.event || "change";
//
//                var bindableObject: IChangeable = <IChangeable> bindable;
//                if((!command) && bindableObject.setValue) {
//                    command = bindableObject.setValue;
//                    context = bindableObject;
//                }
//
//                if (command) {
//                    commandHost.on(options.to, event).react(command, context);
//                }
//            }
//
//            return new FetcherToRendererAdapter(fetcher);
//        }

        switch (options.valueType) {
            case ValueType.text:
                return new TextRenderer(options.formatter);
            case ValueType.html:
                return new HtmlRenderer(options.formatter);
            case ValueType.unknown:
                return new ResolvableMarkupRenderer(options.formatter, this._markupResolver);
            default:
                throw new Error("Unknown value type: " + options.valueType);
        }
    }
}