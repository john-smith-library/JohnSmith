/// <reference path="../libs/jquery.d.ts"/>
/// <reference path="Common.ts"/>
/// <reference path="Listeners.ts"/>
/// <reference path="Observables.ts"/>
/// <reference path="Renderers.ts"/>
/// <reference path="Dom_JQuery.ts"/>
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
}

export interface IListener {
    <T>(observable:IObservable<T>): void;
    <T>(value:T): void;

    observes<T>(observable:IObservable<T>): void;
    observes<T>(value: T): void;
}

export interface IListenerDom {
    $: JQuery;

    <T>(observable:IObservable<T>): void;
    <T>(value:T): void;

    observes<T>(observable:IObservable<T>): void;
    observes<T>(value: T): void;
}

export interface IContextualDom {
    (selector: string): IListenerDom;

    root: IListenerDom;

    manage(manageable: IManageable);
}

export class DomWrapper {
    constructor(private _rootElement: IElement, private _manager: IManager) {
    }

    public find(selector: string):ListenerDom {
        var dom = new ListenerDom(this._rootElement.findRelative(selector), this._manager);
        return Utils.wrapObjectWithSelfFunction(
            dom,
            function(d, value: any, options: any){
                d.observes(value, options);
            });
    }
}

export class ListenerDom {
    public $: JQuery;
    public text: any;
    public html: any;

    constructor(private _rootElement: IElement, private _manager: IManager){
        var textConfig = new ObservationConfig(this._manager, (observable:IObservable<Object>) => ListenerUtils.createListener(observable, this._rootElement, { valueType: ValueType.text}));
        var htmlConfig = new ObservationConfig(this._manager, (observable:IObservable<Object>) => ListenerUtils.createListener(observable, this._rootElement, { valueType: ValueType.html}));

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
        var wire = ListenerUtils.createListener(observable, this._rootElement, options);

        this._manager.manage(wire);
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

export var init = function(api){
    var actualDom = new DomWrapper(
        new JQueryElement($(document)),
        {
            manage: (manageable: IManageable) => manageable.init()
        });

    api.dom = Utils.wrapObjectWithSelfFunction(actualDom, (dom:DomWrapper, selector: string) => dom.find(selector));

    api.observableValue = () => new ObservableValue();
    api.observableList = () => new ObservableValue();
}


class ListenerUtils {
    private static _defaultFormatter: IValueFormatter = value => value.toString();

    public static getObservable(candidate):IObservable<Object> {
        if (candidate && candidate.getValue && candidate.listen) {
            return <IObservable<Object>> candidate;
        }

        return new StaticObservableValue<Object>(candidate);
    }

    public static createListener(observable:IObservable<Object>, root:IElement, options: ListenerOptions): IManageable {
        if (!options) {
            options = {};
        }

        if (!options.renderer) {
            /** try to resolve view first */
            if (options.view) {
                // todo
                // options.renderer = new View.ViewValueRenderer(this._viewFactory, options.view);
            } else {
                /** use default renderer if no view in options */
                if (!options.valueType) {
                    var encode = true;
                    if (options.encode !== undefined){
                        encode = options.encode;
                    }

                    options.valueType = encode ? ValueType.text : ValueType.html;
                }

                if (!options.formatter) {
                    options.formatter = ListenerUtils._defaultFormatter;
                }

                options.renderer = ListenerUtils.getRenderer(options /*, commandHost, bindable*/);
            }
        }

        return new RenderValueListener(observable, root, options.renderer);
    }

    private static getRenderer(options:ListenerOptions /*, commandHost:Command.ICommandHost, bindable:IBindable*/) : IValueRenderer{
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
//            case ValueType.unknown:
//                return new ResolvableMarkupRenderer(options.formatter, this._markupResolver);
            default:
                throw new Error("Unknown value type: " + options.valueType);
        }
    }
}