export interface IDomManager extends IManager {
    getViewModel(): any;
    getParent(): IDomManager;
}

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
    deep?: number;

    init?(dom: IDom, viewModel: TViewModel): void;
    init?<TParentViewModel>(dom: IDom, viewModel: TViewModel, parentViewModel: TParentViewModel): void;
}

/**
 * Resolves provided vew descriptor and creates view.
 */
export interface IViewFactory {
    resolve<TViewModel extends IViewModel>(destination: IElement, dataDescriptor: any, viewModel: any, parent: IDomManager): IComposedView;
}

export interface IComposedView extends IManageable {
    getRootElement():IElement;
}

export class ComposedView<TViewModel  extends IViewModel> implements IDomManager, IComposedView {
    private _slaves: IManageable[];
    private _root: IElement;

    //private _unrender: Events.Event<IViewContext>;

    constructor (
        private _viewData: IView<TViewModel>,
        private _viewModel:TViewModel,
        private _markupResolver: IMarkupResolver,
        private _destination: IElement,
        private _domFactory: IDomFactory,
        private _parent: IDomManager) {

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

    getViewModel(): any {
        return this._viewModel;
    }

    getParent():IDomManager {
        return this._parent;
    }

    private attachViewToRoot(root: IElement):void {
        this._root = root;

        if (this._viewData.init){
            var dom = this._domFactory.create(this._root, this);
            if (this._viewData.deep > 0) {
                var viewModelsOfLevelDeep = this.fetchViewModels(this._viewData.deep);
                viewModelsOfLevelDeep.splice(0, 0, this._viewModel);
                viewModelsOfLevelDeep.splice(0, 0, dom);
                this._viewData.init.apply(this._viewData, viewModelsOfLevelDeep);
            } else {
                this._viewData.init(dom, this._viewModel);
            }
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

    private fetchViewModels(deep: number): any[] {
        var result = [];
        var currentManager = this.getParent();
        var currentLevel = 1;

        while(currentLevel <= deep && currentManager !== null) {

            result.push(currentManager.getViewModel());
            currentManager = currentManager.getParent();

            currentLevel++;
        }

        return result;
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

    public resolve(destination: IElement, dataDescriptor: any, viewModel: any, parent: IDomManager) : IComposedView {
        if (!dataDescriptor){
            throw new Error("Expected view data object was not defined")
        }

        if (Utils.isFunction(dataDescriptor)){
            var newInstance = new dataDescriptor();
            return this.resolve(destination, newInstance, viewModel, parent);
        }

        if (dataDescriptor.template){
            return new ComposedView(
                dataDescriptor,
                viewModel,
                this._markupResolver,
                destination,
                this._domFactory,
                parent);
        }

        if (dataDescriptor.renderTo && dataDescriptor.getRootElement){
            return <IComposedView> dataDescriptor;
        }

        throw new Error("Could not resolve view data by provided descriptor");
    }
}