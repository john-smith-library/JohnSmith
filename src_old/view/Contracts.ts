/// <reference path="../Common.ts"/>
/// <reference path="../Events.ts"/>
/// <reference path="../binding/Contracts.ts"/>

module JohnSmith.View {
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
    export interface IViewData { // todo: rename to View
        template: any;
        init?: (context: IViewContext, viewModel: any) => void;
        unrender?: () => void;
    }

    export interface IViewContext {
        addChild: (destination:any, child:IView, viewModel: any) => void;
        bind: (bindable: any) => Binding.BindingConfig;
        on: (...causeArguments: any[]) => Command.CommandConfig;
        getRootElement: () => Common.IElement;
        onUnrender: () => Events.IEvent<IViewContext>;
    }

    /**
     * Resolves provided vew descriptor and creates view.
     */
    export interface IViewFactory {
        resolve: (dataDescriptor: any, viewModel: any) => IView;
    }

    /**
     * View interface. For internal usage mainly, client meant to use IViewData.
     */
    export interface IView extends Common.IDisposable { // todo rename to something
        renderTo: (destination:any) => void;
        attachTo: (destination:any) => void;
        unrenderView: () => void;
        getRootElement: () => Common.IElement;
    }
}