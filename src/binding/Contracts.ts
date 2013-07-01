/// <reference path="../Common.ts"/>
/// <reference path="../command/Contracts.ts"/>

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

    export interface IChangeable {
        setValue?: (value: any) => void;
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
        createHandler: (options: any, bindable:IBindable, context: JohnSmith.Common.IElement, commandHost: Command.ICommandHost) => IBindableHandler;
    }

    export interface IBindingData {
        bindableData: any;
        context: JohnSmith.Common.IElement;
        handlerData: any[];
        commandHost: Command.ICommandHost;
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

    // sets up bindings between any objects
    export interface IBindableManager {
        bind: (data: IBindingData) => BindingWire;
    }

    export class BindingConfig implements Common.IDisposable {
        private manager: IBindableManager;
        private bindable: any;
        private context: JohnSmith.Common.IElement;
        private commandHost: Command.ICommandHost;
        private wires: BindingWire[];

        constructor(
            manager: IBindableManager,
            bindable: any,
            context: JohnSmith.Common.IElement,
            commandHost: Command.ICommandHost) {
            this.manager = manager;
            this.bindable = bindable;
            this.context = context;
            this.commandHost = commandHost;
            this.wires = [];
        }

        public to(...handler: any[]):BindingConfig {
            var wire = this.manager.bind({
                bindableData: this.bindable,
                handlerData: handler,
                context: this.context,
                commandHost: this.commandHost
            });
            this.wires.push(wire);
            wire.init();
            return this;
        }

        public dispose(){
            for (var i = 0; i < this.wires.length; i++) {
                this.wires[i].dispose();
            }
        }
    }
}