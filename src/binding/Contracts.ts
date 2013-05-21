/// <reference path="../Common.ts"/>

module JohnSmith.Binding {
    /////////////////////////////////
    // Common Enums
    /////////////////////////////////
    export enum DataChangeReason {
        replace,
        add,
        remove,
    }

    /////////////////////////////////
    // Common Interfaces
    /////////////////////////////////
    export interface IBindableListener {
        valueChanged?: (oldValue: Object, newValue: Object, changeType: DataChangeReason) => void;
        stateChanged?: (oldState: string, newState: string) => void;
    }

    export interface IBindable {
        getValue: () => any;
        getState: () => string;
        addListener: (listener: IBindableListener) => void;
        removeListener: (listener: IBindableListener) => void;
    }

    // transforms any object to bindable value
    export interface IBindableFactory
    {
        createBindable: (bindable: any) => IBindable;
    }

    // wires with the bindable and reflects it's changes in UI
    export interface IBindableHandler extends JohnSmith.Common.IDisposable {
        wireWith: (bindable: IBindable) => void;
        unwireWith: (bindable: IBindable) => void;
    }

    // transforms any object to bindable handler
    export interface IHandlerFactory {
        createHandler: (handlerData: any, context: JohnSmith.Common.IElement) => IBindableHandler;
    }
}