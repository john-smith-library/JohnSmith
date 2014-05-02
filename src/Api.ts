export class ExplicitManager implements IDomManager {
    _slaves: IManageable[];

    constructor(){
        this._slaves = [];
    }

    manage(manageable:IManageable):void {
        this._slaves.push(manageable);
        manageable.init();
    }

    dispose(){
        for (var i = 0; i < this._slaves.length; i++) {
            this._slaves[i].dispose();
        }
    }

    getViewModel(): any {
        return null;
    }

    getParent():IDomManager {
        return null;
    }

    onUnrender():IEvent<any> {
        return new Event<any>();
    }
}

export var dom:IDom;
export var observableValue: <T>() => ObservableValue<T>;
export var observableList: <T>() => ObservableList<T>;

export var init = function(){
    var markupResolver: IMarkupResolver = new JQueryMarkupResolver();
    var defaultFormatter: IValueFormatter = value => value.toString();

    var fetcherFactory:IFetcherFactory = new FetcherFactory()
        .registerFetcher(FetcherType.Value, new ValueFetcher())
        .registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());

    var viewFactory: DefaultViewFactory = new DefaultViewFactory(markupResolver);
    var renderListenerFactory: RenderListenerFactory = new RenderListenerFactory(defaultFormatter, markupResolver, viewFactory, fetcherFactory);
    var domFactory: IDomFactory = new DomFactory(renderListenerFactory, <IViewFactory>viewFactory, fetcherFactory)

    viewFactory.setDomFactory(domFactory);  // todo: avoid this bidirectional link

    dom = domFactory.create(new JQueryElement($(document)), new ExplicitManager());
    observableValue = () => new ObservableValue();
    observableList = () => new ObservableList();
}