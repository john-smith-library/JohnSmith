/// <reference path="Common.ts"/>

module JohnSmith.Binding {
    var Log = function(){
        return JohnSmith.Common.log;
    }

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
        stateChanged: (oldState: string, newState: string) => void;
    }

    export interface IBindable {
        getValue: () => any;
        getState: () => string;
        addListener: (listener: IBindableListener) => void;
        removeListener: (listener: IBindableListener) => void;
    }

    // wires with the bindable and reflects it's changes in UI
    export interface IBindableHandler extends JohnSmith.Common.IDisposable {
        wireWith: (bindable: IBindable) => void;
        unwireWith: (bindable: IBindable) => void;
    }

    // transforms any object to bindable value
    export interface IBindableFactory
    {
        createBindable: (bindable: any) => IBindable;
    }

    // transforms any object to bindable handler
    export interface IHandlerFactory {
        createHandler: (handlerData: any, context: JohnSmith.Common.IElement) => IBindableHandler;
    }

    // sets up bindings between any objects
    export interface IBindableManager {
        bind: (bindable: any, handler: any, context: JohnSmith.Common.IElement) => BindingWire;
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

    /// Simple bindable value.
    export class BindableValue implements IBindable {
        private listeners: JohnSmith.Common.ArrayList;
        private value: any;
        private state: string;

        constructor() {
            this.listeners = new JohnSmith.Common.ArrayList();
        }

        public getValue():any {
            return this.value;
        }

        public setValue(value: any) {
            this.notifyListeners(value, DataChangeReason.replace);
            this.value = value;
        }

        public getState() {
            return this.state;
        }

        public setState(state: string) {
            for (var i = 0; i < this.listeners.count(); i++) {
                var listener: IBindableListener = this.listeners.getAt(i);
                listener.stateChanged(this.state, state);
            }

            this.state = state;
        }

        public addListener(listener: IBindableListener) {
            this.listeners.add(listener);
        }

        public removeListener(listener: IBindableListener) {
            var indexToRemove: number = -1;
            for (var i = 0; i < this.listeners.count(); i++) {
                if (this.listeners.getAt(i) == listener) {
                    indexToRemove = i;
                }
            }

            if (indexToRemove >= 0) {
                this.listeners.removeAt(indexToRemove);
            }
        }

        public getListenersCount(): number {
            return this.listeners.count();
        }

        public notifyListeners(newValue:any, reason:DataChangeReason): void {
            for (var i = 0; i < this.listeners.count(); i++) {
                var listener: IBindableListener = this.listeners.getAt(i);
                listener.valueChanged(this.value, newValue, reason);
            }
        }
    }

    export class BindableList extends BindableValue implements IBindable/*, JohnSmith.Common.IList*/ {
        constructor(){
            super();
            super.setValue([]);
        }

        public setValue(value: any) {
            if (value){
                if (!(value instanceof Array)){
                    throw new Error("Bindable list supports only array values");
                }
            }

            super.setValue(value);
        }

        public add(...args:any[]): void {
            var array:Array = this.getValue();
            for (var i = 0; i < args.length; i++){
                array.push(args[i]);
            }

            super.notifyListeners(args, DataChangeReason.add);
        }

        public remove(...args:any[]):void {
            var array:Array = this.getValue();
            for (var i = 0; i < args.length; i++){
                var indexToRemove:number = -1;
                for (var j = 0; j < array.length; j++){
                    if (array[j] == args[i]){
                        indexToRemove = j;
                    }
                }

                if (indexToRemove >= 0){
                    array.splice(indexToRemove, 1);
                }
            }

            super.notifyListeners(args, DataChangeReason.remove);
        }
    }

    export class StaticBindableValue implements IBindable {
        private value: any;

        constructor(value:any) {
            this.value = value;
        }

        public getValue(): any {
            return this.value;
        }

        public getState() {
            return "normal";
        }

        public addListener(listener: IBindableListener) {
        }

        public removeListener(listener: IBindableListener) {
        }
    }

    // default implementation of binding manager
    export class DefaultBindingManager implements IBindableManager {
        private handlerFactories: JohnSmith.Common.ArrayList;
        private bindableFactories: JohnSmith.Common.ArrayList;
        private handlerDataTransformers: JohnSmith.Common.IList;

        constructor(
            bindableFactories:  JohnSmith.Common.ArrayList,
            handlerFactories: JohnSmith.Common.ArrayList,
            handlerDataTransformers: JohnSmith.Common.IList) {

            this.bindableFactories = bindableFactories;
            this.handlerFactories = handlerFactories;
            this.handlerDataTransformers = handlerDataTransformers;
        }

        public bind(bindableData: any, handlerData: any, context: JohnSmith.Common.IElement): BindingWire {
            Log().info("Binding ", bindableData, " to ", handlerData);

            var bindable: IBindable = this.getBindable(bindableData);
            var handler: IBindableHandler = this.getHandler(handlerData, context);

            Log().info("    resolved bindable: ", bindable);
            Log().info("    resolved handler: ", handler);

            var result: BindingWire = new BindingWire(bindable, handler);
            return result;
        }

        private getBindable(bindableObject: any): IBindable {
            for (var i = 0; i < this.bindableFactories.count(); i++) {
                var factory: JohnSmith.Binding.IBindableFactory = this.bindableFactories.getAt(i);
                var result: IBindable = factory.createBindable(bindableObject);
                if (result != null) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + bindableObject + " to bindable");
        }

        private getHandler(handlerObject: any, context: JohnSmith.Common.IElement): IBindableHandler {
            var data: any = handlerObject;
            for (var i = 0; i < this.handlerDataTransformers.count(); i++){
                data = this.handlerDataTransformers.getAt(i).transform(data, context);
            }

            for (var i = 0; i < this.handlerFactories.count(); i++) {
                var factory: JohnSmith.Binding.IHandlerFactory = this.handlerFactories.getAt(i);
                var result: IBindableHandler = factory.createHandler(data, context);
                if (result) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + handlerObject + " to bindable handler");
        }
    }

    /////////////////////////////////
    // Bindable Handlers
    /////////////////////////////////

    // Converts a value to string representation.
    export interface IValueFormatter {
        format: (value: any) => string;
        dispose?: () => void;
    }

    // Renders value to DOM element.
    export interface IValueRenderer {
        render: (value: any, destination: JohnSmith.Common.IElement) => JohnSmith.Common.IElement;
        dispose?: () => void;
    }

//    export interface IListContentDestination {
//        empty: () => void;
//        append: (item: any, html: string) => void;
//        remove: (item: any) => void;
//    }

    export interface IValueToElementMapper {
        getElementFor(value:any, root:JohnSmith.Common.IElement):JohnSmith.Common.IElement;
        attachValueToElement(value:any, element:JohnSmith.Common.IElement);
    }

    export class RenderValueHandler implements IBindableHandler, IBindableListener {
        private contentDestination: JohnSmith.Common.IElement;
        private valueRenderer: IValueRenderer;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer) {

            this.contentDestination = contentDestination;
            this.valueRenderer = renderer;
        }

        public wireWith(bindable: IBindable) {
            this.doRender(bindable.getValue())
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
            this.doRender(newValue);
        }

        public stateChanged(oldState: string, newState: string) {
        }

        public dispose(): void {
            if (this.valueRenderer.dispose) {
                this.valueRenderer.dispose();
            }
        }

        private doRender(value: any):void {
            this.contentDestination.empty();
            if (value) {
                this.valueRenderer.render(value, this.contentDestination)
            };
        }
    }

    export class RenderListHandler implements IBindableHandler, IBindableListener {
        private contentDestination: JohnSmith.Common.IElement;
        private valueRenderer: IValueRenderer;
        private mapper:IValueToElementMapper;

        constructor(
            contentDestination: JohnSmith.Common.IElement,
            renderer:IValueRenderer,
            mapper:IValueToElementMapper) {

            this.contentDestination = contentDestination;
            this.valueRenderer = renderer;
            this.mapper = mapper;
        }

        public wireWith(bindable: IBindable) {
            this.doRender(bindable.getValue(), DataChangeReason.replace)
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
            this.doRender(newValue, changeType);
        }

        public stateChanged(oldState: string, newState: string) {
        }

        public dispose(): void {
            if (this.valueRenderer.dispose) {
                this.valueRenderer.dispose();
            }
        }

        private doRender(value: any, reason:DataChangeReason):void {
            if (!value){
                return;
            }

            var items:Array = value;

            if (reason == DataChangeReason.remove){
                for (var i = 0; i < items.length; i++){
                    var item = items[i];
                    var itemElement = this.mapper.getElementFor(item, this.contentDestination);
                    if (itemElement) {
                        itemElement.remove();
                    }
                }
            } else if (reason == DataChangeReason.add) {
                this.appendItems(value);
            } else {
                this.contentDestination.empty();
                this.appendItems(value);
            }
        }

        private appendItems(items:Array):void {
            for (var i = 0; i < items.length; i++){
                var item = items[i];
                var itemElement = this.valueRenderer.render(item, this.contentDestination);
                this.mapper.attachValueToElement(item, itemElement);
            }
        }
    }

    export interface StateTransitionHandlerItem {
        isMatched: (oldState: string, newState: string) => bool;
        handle: (oldState: string, newState: string) => void;
    }

    export class StateTransitionHandler implements IBindableHandler, IBindableListener {
        private items:JohnSmith.Common.IList;

        constructor (...args:StateTransitionHandlerItem[]){
            this.items = new JohnSmith.Common.ArrayList();
            for (var i = 0; i < args.length; i++){
                this.items.add(args[i])
            }
        }

        public wireWith(bindable: IBindable) {
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
        }

        public stateChanged(oldState: string, newState: string) {
            for (var i = 0; i < this.items.count(); i++){
                var item:StateTransitionHandlerItem = this.items.getAt(i);
                if (item.isMatched(oldState, newState)){
                     item.handle(oldState, newState);
                }
            }
        }

        public dispose():void {
            this.items.clear();
        }
    }

    /////////////////////////////////
    // Handler Factory
    /////////////////////////////////

    // Transforms handler data to canonical form.
    export interface IHandlerDataTransformer {
         description?: string;
         transform: (data:any, context:JohnSmith.Common.IElement) => any;
    }

    export interface HandlerOptions {
        handler: string;
    }

    export interface RenderHandlerOptions extends HandlerOptions {
        contentDestination?: JohnSmith.Common.IElement;
        renderer?: IValueRenderer;
    }

    export interface RenderListOptions extends RenderHandlerOptions {
        mapper?: IValueToElementMapper;
    }

    export class RenderValueFactory implements JohnSmith.Binding.IHandlerFactory {
        public createHandler(handlerData: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (!handlerData) {
                return null;
            }

            var options: RenderHandlerOptions = handlerData;
            if ((!options.handler) || (options.handler != "render")) {
                return null;
            }

            if (!options.contentDestination) {
                throw new Error("Required option 'contentDestination' is not set!");
            }

            if (!options.renderer) {
                throw new Error("Required option 'renderer' is not set!")
            }

            var handler = new RenderValueHandler(
                options.contentDestination,
                options.renderer);

            return handler;
        }
    }

    export class RenderListFactory implements IHandlerFactory {
        public createHandler(handlerData: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (!handlerData) {
                return null;
            }

            var options: RenderListOptions = handlerData;
            if ((!options.handler) || (options.handler != "list")) {
                return null;
            }

            if (!options.contentDestination) {
                throw new Error("Required option 'contentDestination' is not set!");
            }

            if (!options.renderer) {
                throw new Error("Required option 'renderer' is not set!")
            }

            if (!options.mapper) {
                throw new Error("Required option 'mapper' is not set!")
            }

            var handler = new RenderListHandler(
                options.contentDestination,
                options.renderer,
                options.mapper);

            return handler;
        }
    }

    /////////////////////////////////
    // Config
    /////////////////////////////////

    export class BindingConfig {
        private manager: IBindableManager;
        private bindable: any;
        private context: JohnSmith.Common.IElement;

        constructor(manager: IBindableManager, bindable: any, context: JohnSmith.Common.IElement) {
            this.manager = manager;
            this.bindable = bindable;
            this.context = context;
        }

        public to(handler: any):BindingConfig {
            this.manager.bind(this.bindable, handler, this.context).init();
            return this;
        }
    }

    class StaticBindableFactory implements IBindableFactory {
        public createBindable(bindable: any): IBindable {
            return new StaticBindableValue(bindable);
        }
    }

    class DefaultBindableFactory implements IBindableFactory {
        public createBindable(bindable: any): IBindable {
            if (bindable && bindable.getValue && bindable.addListener) {
                return bindable;
            }

            return null;
        }
    }

    var bindableFactories:JohnSmith.Common.ArrayList = new JohnSmith.Common.ArrayList();
    var handlerFactories:JohnSmith.Common.ArrayList = new Common.ArrayList();
    var transformersChain:JohnSmith.Common.IList = new JohnSmith.Common.ArrayList();

    /* Configure handlers */

    handlerFactories.add(new RenderListFactory());
    handlerFactories.add(new RenderValueFactory());
    handlerFactories.add({
        createHandler: function (handler: any, context: JohnSmith.Common.IElement): Binding.IBindableHandler {
            if (handler && handler.wireWith && handler.unwireWith) {
                return handler;
            }

            return null;
        }
    });

    /* Configure bindable */

    bindableFactories.add(new DefaultBindableFactory());
    bindableFactories.add(new StaticBindableFactory());

    var bindingManager = new DefaultBindingManager(bindableFactories, handlerFactories, transformersChain);

    js.ioc.register("bindingManager", bindingManager);

    js.getBindableFactories = function():JohnSmith.Common.IList {
        return bindableFactories;
    }

    js.getHandlerFactories = function():JohnSmith.Common.IList {
        return handlerFactories;
    }

    js.getHandlerDataTransformers = function():JohnSmith.Common.IList {
        return transformersChain;
    }

    js.addHandlerFactory = function(transformer: JohnSmith.Binding.IHandlerFactory) {
        handlerFactories.insertAt(0, transformer);
    }

    js.addHandlerTransformer = function(transformer: JohnSmith.Binding.IHandlerDataTransformer, isImportant:bool = false){
        if (isImportant) {
            transformersChain.insertAt(0, transformer);
        } else {
            transformersChain.add(transformer);
        }
    }

    js.bindableValue = function():JohnSmith.Binding.BindableValue {
        return new BindableValue();
    }

    js.bindableList = function():JohnSmith.Binding.BindableList {
        return new BindableList();
    }

    js.bind = function(bindable: any): JohnSmith.Binding.BindingConfig {
        return new BindingConfig(bindingManager, bindable, null);
    }

    js.addHandlerTransformer({
        description: "{} => {handler: 'render'} [Sets handler to 'render' if it is not set]",
        transform: function(data: any, context: JohnSmith.Common.IElement): any{
            if (data && typeof data === "object") {
                if (!data.handler){
                    data.handler = "render";
                }
            }

            return data;
        }
    });

    js.addHandlerTransformer({
        description: "{handler: 'render'} => {formatter: IValueFormatter} [Sets default formatter]",
        transform: function(data: any, context: JohnSmith.Common.IElement): any{
            if (data && typeof data === "object" && data.handler && (data.handler === "render" || data.handler === "list")) {
                if ((!data.formatter) && (!data.renderer)){
                    data.formatter =  {
                        format: function (value: any): string {
                            return value;
                        }
                    }
                }
            }

            return data;
        }
    });

    js.addHandlerTransformer({
        description: "{formatter: IValueFormatter} => {renderer: IValueRenderer} [Converts value formatter to value renderer]",
        transform: function(data: any, context: JohnSmith.Common.IElement): any{
            if (data && typeof data === "object" && data.handler && (data.handler === "render" || data.handler === "list")) {
                if (data.formatter && (!data.renderer)){
                    var formatter = <JohnSmith.Binding.IValueFormatter> data.formatter;
                    data.renderer =  {
                        render: function(value: any, destination: JohnSmith.Common.IElement) : JohnSmith.Common.IElement {
                            var formattedValue = formatter.format(value);
                            var result = destination.append(formattedValue);

                            js.event.bus.trigger(
                                "valueRendered",
                                {
                                    originalValue: value,
                                    formattedValue: formattedValue,
                                    root: result,
                                    destination: destination
                                });

                            //destination.append("<div style='position: absolute; background: green; padding: 5px; font-size: 11px;'>bound</div>");
                            return  result;
                        }
                    }

                    if (formatter.dispose) {
                        data.renderer.dispose = function(){
                            formatter.dispose;
                        }
                    }
                }
            }

            return data;
        }
    });
}