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

/*
export interface IChildView {
    child: IView;
    destination: any;
    viewModel: any;
}*/

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

    /*
    public addChild(destination:any, child:IView, viewModel: any){
        if (!this.hasChildren()) {
            this._children = [];
        }

        this._children.push({
            child: child,
            destination: destination,
            viewModel: viewModel
        });
    }*/

    /*
    // todo write tests for this
    public attachTo(destination:any):void {
        var destinationElement = typeof destination == "string" ?
            this._elementFactory.createElement(destination) :
            destination;

        this.attachViewToRoot(destinationElement);
    }*/

    /*
    public renderTo(destination:any):void {

    }*/

    /*
    public onUnrender():Events.IEvent<IViewContext> {
        return this._unrender;
    }*/

    private attachViewToRoot(root: IElement):void {
        this._root = root;

        if (this._viewData.init){
            var dom = this._domFactory.create(this._root, this);
            this._viewData.init(dom, this._viewModel);
        }

        for (var i = 0; i < this._slaves.length; i++) {
            this._slaves[i].init();
        }

//        if (this.hasChildren()){
//            for (var i = 0; i < this._children.length; i++) {
//                var childData = this._children[i];
//                var viewModel = childData.viewModel;
//                var child = this._viewFactory.resolve(childData.child, viewModel);
//                child.renderTo(this._rootElement.findRelative(childData.destination));
//            }
//        }

        if (this._viewModel && this._viewModel.initState){
            this._viewModel.initState();
        }
    }

//    public bind(bindable: any): Binding.BindingConfig {
//        var binding = new Binding.BindingConfig(
//            this._bindableManager,
//            bindable,
//            this._rootElement,
//            this,
//            false);
//
//        this._bindings.push(binding);
//
//        return  binding;
//    }

//    public on(...causeArguments: any[]): Command.CommandConfig {
//        var commandConfig = new Command.CommandConfig(
//            causeArguments,
//            this._commandManager,
//            this.getRootElement(),
//            this._viewModel);
//
//        this._commands.push(commandConfig);
//
//        return  commandConfig;
//    }

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

        /* dispose children */
//        if (this.hasChildren()){
//            for (var i = 0; i < this._children.length; i++){
//                this._children[i].child.dispose();
//            }
//        }

        /* dispose bindings */
//        for (var i = 0; i < this._bindings.length; i++) {
//            this._bindings[i].dispose();
//        }

        /* dispose commands */
//        for (var i = 0; i < this._commands.length; i++) {
//            this._commands[i].dispose();
//        }
    }

//    private hasChildren():boolean {
//        return this._children != null;
//    }
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