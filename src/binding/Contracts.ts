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
        valueChanged: (oldValue: Object, newValue: Object, changeType: DataChangeReason) => void;
    }

    export interface IBindable {
        getValue: () => any;
        addListener: (listener: IBindableListener) => void;
        removeListener: (listener: IBindableListener) => void;
    }

    export interface IChangeable {
        setValue?: (value: any) => void;
    }

    // transforms any object to bindable value
    // [obsolete]
    // todo get rid of this factory
    export interface IBindableFactory
    {
        createBindable: (bindable: any) => IBindable;
    }

    // wires with the bindable and reflects it's changes in UI
    // todo replace handler with direct listener
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
        private _bindable: IBindable;
        private _handler: IBindableHandler;

        constructor(bindable: IBindable, handler: IBindableHandler) {
            this._bindable = bindable;
            this._handler = handler;
        }

        // initializes the wire
        public init() {
            this._handler.wireWith(this._bindable);
        }

        // disposes the wire
        public dispose() {
            this._handler.unwireWith(this._bindable);
            this._handler.dispose();
        }

        public getBindable():IBindable {
            return this._bindable;
        }

        public getHandler():IBindableHandler {
            return this._handler;
        }
    }

    // sets up bindings between any objects
    export interface IBindableManager {
        bind: (data: IBindingData) => BindingWire;
    }

    export class BindingConfig implements Common.IDisposable {
        private _manager: IBindableManager;
        private _bindable: any;
        private _context: JohnSmith.Common.IElement;
        private _commandHost: Command.ICommandHost;
        private _wires: BindingWire[];
        private _initImmediately: boolean;

        constructor(
            manager: IBindableManager,
            bindable: any,
            context: JohnSmith.Common.IElement,
            commandHost: Command.ICommandHost,
            initImmediately: boolean) {
            this._manager = manager;
            this._bindable = bindable;
            this._context = context;
            this._commandHost = commandHost;
            this._wires = [];
            this._initImmediately = initImmediately;
        }

        public to(...handler: any[]):BindingConfig {
            var wire = this._manager.bind({
                bindableData: this._bindable,
                handlerData: handler,
                context: this._context,
                commandHost: this._commandHost
            });
            this._wires.push(wire);

            if (this._initImmediately) {
                wire.init();
            }

            return this;
        }

        public init() {
            for (var i = 0; i < this._wires.length; i++){
                this._wires[i].init();
            }
        }

        public dispose(){
            for (var i = 0; i < this._wires.length; i++) {
                this._wires[i].dispose();
            }
        }
    }
}