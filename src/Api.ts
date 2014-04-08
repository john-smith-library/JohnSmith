export class ExplicitManager implements IManager {
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
}

export var init = function(api){
    var markupResolver: IMarkupResolver = new JQueryMarkupResolver();
    var defaultFormatter: IValueFormatter = value => value.toString();

    var factory:IFetcherFactory = new FetcherFactory()
        .registerFetcher(FetcherType.Value, new ValueFetcher())
        .registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());

    var viewFactory: DefaultViewFactory = new DefaultViewFactory(markupResolver);
    var renderListenerFactory: RenderListenerFactory = new RenderListenerFactory(defaultFormatter, markupResolver, viewFactory);
    var domFactory: IDomFactory = new DomFactory(renderListenerFactory, <IViewFactory>viewFactory)

    viewFactory.setDomFactory(domFactory);  // todo: avoid this bidirectional link

    api.dom = domFactory.create(new JQueryElement($(document)), new ExplicitManager());
    api.observableValue = () => new ObservableValue();
    api.observableList = () => new ObservableList();
}