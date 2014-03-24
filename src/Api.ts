export var init = function(api){
    var markupResolver: IMarkupResolver = new JQueryMarkupResolver();
    var defaultFormatter: IValueFormatter = value => value.toString();
    var renderListenerFactory: RenderListenerFactory = new RenderListenerFactory(defaultFormatter, markupResolver);
    var viewFactory: IViewFactory = new DefaultViewFactory(markupResolver, renderListenerFactory);

    var actualDom = new DomWrapper(
        new JQueryElement($(document)),
        {
            manage: (manageable: IManageable) => manageable.init()
        },
        renderListenerFactory,
        viewFactory);

    api.dom = Utils.wrapObjectWithSelfFunction(actualDom, (dom:DomWrapper, selector: string) => dom.find(selector));
    api.observableValue = () => new ObservableValue();
    api.observableList = () => new ObservableValue();
}
