/// <reference path="../libs/jquery.d.ts"/>
/// <reference path="Common.ts"/>
/// <reference path="Listeners.ts"/>
/// <reference path="Observables.ts"/>
/// <reference path="Renderers.ts"/>
/// <reference path="Dom_JQuery.ts"/>
/// <reference path="Commands.ts"/>
/// <reference path="Fetchers.ts"/>
/// <reference path="Utils.ts"/>

export interface ListenerOptions  {
    renderer?: IValueRenderer;
    formatter?: IValueFormatter;
    valueType?: string;
    fetch?: string;
    view?: any;
    type?: string;
    encode?: boolean;
    bidirectional?: boolean;

    event?: string;
    command?: Function;
    commandContext?: any;
}

export interface IDom extends IDisposable {
    (selector: string): IListenerDom;
    find(selector: string): IListenerDom;
}

export interface IListenerDom {
    $: JQuery;
    root: IElement;

    <T>(observable:IObservable<T>): void;
    <T>(value:T): void;

    observes<T>(observable:IObservable<T>): void;
    observes<T>(value: T): void;

    on(event: string, options?: ICommandOptions): CommandConfig;
}

class DomWrapper implements IDisposable {
    constructor(
        private _rootElement: IElement,
        private _manager: IManager,
        private _renderListenerFactory: RenderListenerFactory,
        private _viewFactory: IViewFactory,
        private _fetcherFactory: IFetcherFactory) {
    }

    public find(selector: string): IListenerDom {
        var dom = new ListenerDom(this._rootElement.findRelative(selector), this._manager, this._renderListenerFactory, this._viewFactory, this._fetcherFactory);
        return <IListenerDom> Utils.wrapObjectWithSelfFunction(
            dom,
            function(d, value: any, options: any){
                d.observes(value, options);
            });
    }

    public dispose(){
        this._manager.dispose();
    }
}

class ListenerDom {
    public $: JQuery;
    public text: any;
    public html: any;
    public root: IElement;

    constructor(
        private _rootElement: IElement,
        private _manager: IManager,
        private _renderListenerFactory: RenderListenerFactory,
        private _viewFactory: IViewFactory,
        private _fetcherFactory: IFetcherFactory){

        this.root = _rootElement;

        var textConfig = new ObservationConfig(this._manager, (observable:IObservable<Object>) => this.createRenderListener(observable, { valueType: ValueType.text}));
        var htmlConfig = new ObservationConfig(this._manager, (observable:IObservable<Object>) => this.createRenderListener(observable, { valueType: ValueType.html}));

        this.$ = this._rootElement.$;
        this.text = Utils.wrapObjectWithSelfFunction(
            textConfig,
            (config:ObservationConfig, value: any) => config.observes(value));

        this.html = Utils.wrapObjectWithSelfFunction(
            htmlConfig,
            (config:ObservationConfig, value: any) => config.observes(value));
    }

    observes<T>(observable:IObservable<T>, viewClass: Function): void;
    observes<T>(observable:IObservable<T>, options: any): void;
    observes<T>(value: T, viewClass: Function): void;
    observes<T>(value: T, options?: ListenerOptions): void;
    observes(value: any, options?: ListenerOptions): void
    {
        var observable:IObservable<Object> = ListenerUtils.getObservable(value);
        if (options && Utils.isFunction(options)) {
            var view = options;
            options = {
                view: view
            }
        }
        var wire = this.createRenderListener(observable, options);

        this._manager.manage(wire);
    }

    public render(view, viewModel?:IViewModel) {
        var composedView = this._viewFactory.resolve(this._rootElement, view, viewModel);
        this._manager.manage(composedView);
    }

    public on(event: string, options?: ICommandOptions): CommandConfig {
        return new CommandConfig(
            this._manager,
            event,
            this._rootElement,
            options,
            this._fetcherFactory);
    }

    private createRenderListener(observable:IObservable<Object>, options: ListenerOptions){
        var listener: any = this;
        return this._renderListenerFactory.createListener(observable, <IListenerDom>listener, options);
    }
}

export class ObservationConfig {
    constructor(private _manager:IManager, private factory: (observable: IObservable<Object>) => IManageable){
    }

    observes<T>(observable:IObservable<T>): void;
    observes<T>(value: T): void;
    observes(value: any): void
    {
        var observable:IObservable<Object> = ListenerUtils.getObservable(value);
        var wire = this.factory(observable);
        this._manager.manage(wire);
    }
}

module ListenerUtils {
    export var getObservable = function(candidate):IObservable<Object> {
        if (candidate && candidate.getValue && candidate.listen) {
            return <IObservable<Object>> candidate;
        }

        return new StaticObservableValue<Object>(candidate);
    }
}

export interface IDomFactory {
    create(root: IElement, manager: IManager): IDom;
}

export class DomFactory implements IDomFactory {
    constructor(
        private _renderListenerFactory: RenderListenerFactory,
        private _viewFactory:IViewFactory,
        private _fetcherFactory:IFetcherFactory){
    }

    public create(root: IElement, manager: IManager): IDom {
        var actualDom = new DomWrapper(
            root, manager,
            this._renderListenerFactory,
            this._viewFactory,
            this._fetcherFactory);

        return <IDom> Utils.wrapObjectWithSelfFunction(actualDom, (dom:DomWrapper, selector: string) => dom.find(selector));
    }
}