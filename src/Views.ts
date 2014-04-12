/**
 * Optional view model interface
 */
export interface IViewModel {
    initState?: () => void;
    releaseState?: () => void;
}

/**
 * Describes the data needed for creating a view.
 */
export interface IView<TViewModel extends IViewModel> {
    template: any;
    init?: (dom: IDom, viewModel: TViewModel) => void;
}

/**
 * Resolves provided vew descriptor and creates view.
 */
export interface IViewFactory {
    resolve<TViewModel extends IViewModel>(destination: IElement, dataDescriptor: any, viewModel: any): IComposedView;
}

export interface IComposedView extends IManageable {
    getRootElement():IElement;
}

export class ComposedView<TViewModel  extends IViewModel> implements IManager, IComposedView {
    private _slaves: IManageable[];
    private _root: IElement;

    //private _unrender: Events.Event<IViewContext>;

    constructor (
        private _viewData: IView<TViewModel>,
        private _viewModel:TViewModel,
        private _markupResolver: IMarkupResolver,
        private _destination: IElement,
        private _domFactory: IDomFactory) {

        this._slaves = [];
        //this._unrender = new Events.Event<IViewContext>();
    }

    public manage(manageable: IManageable) {
        this._slaves.push(manageable);
    }

    public init(){
        var templateHtml = this._markupResolver.resolve(this._viewData.template);

        var root = this._destination.appendHtml(templateHtml);

        this.attachViewToRoot(root);
    }

    private attachViewToRoot(root: IElement):void {
        this._root = root;

        if (this._viewData.init){
            var dom = this._domFactory.create(this._root, this);
            this._viewData.init(dom, this._viewModel);
        }

        for (var i = 0; i < this._slaves.length; i++) {
            this._slaves[i].init();
        }

        if (this._viewModel && this._viewModel.initState){
            this._viewModel.initState();
        }
    }

    public getRootElement(): IElement {
        return this._root;
    }

    public unrenderView() {
        /*
        if (this._unrender.hasListeners()){
            this._unrender.trigger(this);
        } else {*/
            this.getRootElement().remove();
        /*}*/
    }

    public dispose(): void {
        this.unrenderView();

        /* release viewModel state before disposing
         *  to make sure the model will not attempt to use bindables */
        if (this._viewModel && this._viewModel.releaseState){
            this._viewModel.releaseState();
        }

        for (var i = 0; i < this._slaves.length; i++) {
            this._slaves[i].dispose();
        }
    }
}

/**
 * Default implementation of IViewFactory
 */
export class DefaultViewFactory implements IViewFactory {
    private _domFactory: IDomFactory;

    constructor (
        private _markupResolver: IMarkupResolver){
    }

    public setDomFactory(domFactory: IDomFactory){
        this._domFactory = domFactory;
    }

    public resolve(destination: IElement, dataDescriptor: any, viewModel: any) : IComposedView {
        if (!dataDescriptor){
            throw new Error("Expected view data object was not defined")
        }

        if (Utils.isFunction(dataDescriptor)){
            var newInstance = new dataDescriptor();
            return this.resolve(destination, newInstance, viewModel);
        }

        if (dataDescriptor.template){
            return new ComposedView(
                dataDescriptor,
                viewModel,
                this._markupResolver,
                destination,
                this._domFactory);
        }

        if (dataDescriptor.renderTo && dataDescriptor.getRootElement){
            return <IComposedView> dataDescriptor;
        }

        throw new Error("Could not resolve view data by provided descriptor");
    }
}