/// <reference path="../Common.ts"/>

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
    export interface IViewData {
        template: any;
        init?: (viewModel: any) => void;
        unrender?: () => void;
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
    export interface IView extends Common.IDisposable {
        renderTo: (destination:any) => void;
        attachTo: (destination:any) => void;
        unrenderView: () => void;
        getRootElement: () => Common.IElement;
    }
}