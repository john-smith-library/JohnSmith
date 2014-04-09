export class RenderValueListener<T> implements IManageable {
    private _currentValue: IRenderedValue;
    private _link: IDisposable;

    constructor(
        private _observable:IObservable<T>,
        private _contentDestination: IElement,
        private _renderer:IValueRenderer) {
    }

    public init(): void {
        this.doRender(this._observable.getValue());
        this._observable.listen((value: T) => this.doRender(value));
        /* todo: why we do not assign _link here??? */
    }

    public dispose(): void {
        /* todo: test it really disposes */
        /* todo: check if link is not null on dispose */
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

export interface IRenderedValueData {
    value: any;
    renderedValue: IRenderedValue;
}

export class RenderListHandler<T> implements IManageable {
    private _renderedValues: IRenderedValueData[];
    private _link: IDisposable;

    constructor(
        private _observable:IObservable<T[]>,
        private _contentDestination: IElement,
        private _renderer:IValueRenderer){
        this._renderedValues = [];
    }

    dispose():void {
        if (this._link) {
            this._link.dispose();
        }

        for (var i = 0; i < this._renderedValues.length; i++){
            if (this._renderedValues[i].renderedValue.dispose){
                this._renderedValues[i].renderedValue.dispose();
            }
        }
    }

    init():void {
        this.doRender(this._observable.getValue(), DataChangeReason.replace);
        this._observable.listen((value: T[], oldValue: T[], details: IChangeDetails<T[]>) => this.doRender(details.portion, details.reason));
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

    private doRender(value: T[], reason:DataChangeReason):void {
        var items:any[] = value;

        if (reason == DataChangeReason.remove){
            for (var i = 0; i < items.length; i++){
                var item = items[i];
                var itemRenderedValue = this.findRenderedValue(item);
                if (itemRenderedValue) {
                    itemRenderedValue.dispose();
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

    private appendItems(items:any[]):void {
        if (!items) {
            return;
        }

        for (var i = 0; i < items.length; i++){
            var item = items[i];
            var itemRenderedValue = this._renderer.render(item, this._contentDestination);
            this._renderedValues.push({
                value: item,
                renderedValue: itemRenderedValue
            });
        }
    }
}

export class RenderListenerFactory {
    constructor(
        private _defaultFormatter: IValueFormatter,
        private _markupResolver: IMarkupResolver,
        private _viewFactory: IViewFactory,
        private _fetcherFactory: IFetcherFactory){}

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

                options.renderer = this.getRenderer(options, root);
            }
        }

        if (this.isList(observable)){
            return new RenderListHandler(<IObservable<Object[]>> observable, root, options.renderer);
        }

        return new RenderValueListener(observable, root, options.renderer);
    }

    private getRenderer(options:ListenerOptions, root:IElement) : IValueRenderer{
        var fetcher:IFetcher = null;

        if (options.fetch) {
            fetcher = this._fetcherFactory.getByKey(options.fetch);
            if (!fetcher) {
                throw new Error("Fetcher " + options.fetch + " not found");
            }
        } else {
            fetcher = this._fetcherFactory.getForElement(root);
        }

        if (fetcher) {
            /*
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
            }*/

            return new FetcherToRendererAdapter(fetcher);
        }

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

    public isList(bindable:IObservable<Object>):boolean {
        if (bindable instanceof ObservableList){
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