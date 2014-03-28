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
    var renderListenerFactory: RenderListenerFactory = new RenderListenerFactory(defaultFormatter, markupResolver);
    var viewFactory: IViewFactory = new DefaultViewFactory(markupResolver, renderListenerFactory);

    var actualDom = new DomWrapper(
        new JQueryElement($(document)), new ExplicitManager(),
        renderListenerFactory,
        viewFactory);

    api.dom = Utils.wrapObjectWithSelfFunction(actualDom, (dom:DomWrapper, selector: string) => dom.find(selector));
    api.observableValue = () => new ObservableValue();
    api.observableList = () => new ObservableValue();
}