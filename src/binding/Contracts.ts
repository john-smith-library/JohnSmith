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
        createHandler: (options: any, bindable:IBindable, context: JohnSmith.Common.IElement) => IBindableHandler;
    }

    export interface IBindingData {
        bindableData: any;
        context: JohnSmith.Common.IElement;
        handlerData: any[];
    }

    // stores a combination of bindable and handler
    export class BindingWire implements JohnSmith.Common.IDisposable {
        private bindable: IBindable;
        private handler: IBindableHandler;

        constructor(bindable: IBindable, handler: IBindableHandler) {
            this.bindable = bindable;
            this.handler = handler;
        }

        // initializes the wire
        public init() {
            this.handler.wireWith(this.bindable);
        }

        // disposes the wire
        public dispose() {
            this.handler.unwireWith(this.bindable);
            this.handler.dispose();
        }

        public getBindable():IBindable {
            return this.bindable;
        }

        public getHandler():IBindableHandler {
            return this.handler;
        }
    }

    /**
     * Process an argument passed to BindableManager as handler data.
     */
    export interface IHandlerArgumentProcessor {
        canProcess(argument:any, argumentIndex: number, options: any, bindable:IBindable, context:JohnSmith.Common.IElement) : bool;
        process(argument:any, options: any, bindable:IBindable, context:JohnSmith.Common.IElement);
    }

    // sets up bindings between any objects
    export interface IBindableManager {
        bind: (data: IBindingData) => BindingWire;
    }

    export class BindingConfig {
        private manager: IBindableManager;
        private bindable: any;
        private context: JohnSmith.Common.IElement;

        constructor(manager: IBindableManager, bindable: any, context: JohnSmith.Common.IElement) {
            this.manager = manager;
            this.bindable = bindable;
            this.context = context;
        }

        public to(...handler: any[]):BindingConfig {
            this.manager.bind({
                bindableData: this.bindable,
                handlerData: handler,
                context: this.context
            }).init();
            return this;
        }
    }
}