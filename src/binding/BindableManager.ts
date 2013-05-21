/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    var Log = function(){
        return JohnSmith.Common.log;
    }

    export interface IBindingData {
        bindableData: any;
        context: JohnSmith.Common.IElement;
        handlerData: any[];
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

    // sets up bindings between any objects
    export interface IBindableManager {
        bind: (data: IBindingData) => BindingWire;
    }

    export enum TransformerApplicability {
        NotApplicable,
        Applicable,
        Unknown
    }

    // Transforms handler data to canonical form.
    export interface IHandlerDataTransformer {
        description?: string;
        checkApplicability: (data:any[], bindable:IBindable, context:JohnSmith.Common.IElement) => TransformerApplicability;
        transform: (data:any[], bindable:IBindable, context:JohnSmith.Common.IElement) => any[];
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

        public bind(data:IBindingData): BindingWire {
            Log().info("Binding ", data.bindableData, " to ", data.handlerData);

            var bindable: IBindable = this.getBindable(data.bindableData);
            var handler: IBindableHandler = this.getHandler(data.handlerData, bindable, data.context);

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

        private getHandler(handlerData: any[], bindable:IBindable, context: JohnSmith.Common.IElement): IBindableHandler {
            this.transformHandlerData(handlerData, bindable, context);

            for (var i = 0; i < this.handlerFactories.count(); i++) {
                var factory: IHandlerFactory = this.handlerFactories.getAt(i);
                var result: IBindableHandler = factory.createHandler(handlerData[0], context);
                if (result) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + handlerData + " to bindable handler");
        }

        private transformHandlerData(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement){
            if (!this.handlerDataTransformers){
                return;
                Log().warn("  no transformers defined");
            }

            var transformers: IHandlerDataTransformer[] = [];

            // copy transformers to new array
            for (var i = 0; i < this.handlerDataTransformers.count(); i++){
                transformers.push(this.handlerDataTransformers.getAt(i));
            }

            var isTransformed = false;
            var lastTransformersCount;
            while(!isTransformed){
                // do transformation iteration
                var currentTransformerIndex = 0;
                lastTransformersCount = transformers.length;
                while (currentTransformerIndex < transformers.length) {
                    var currentTransformer:IHandlerDataTransformer = transformers[currentTransformerIndex];
                    var applicability = currentTransformer.checkApplicability(data, bindable, context);
                    switch (applicability){
                        case TransformerApplicability.NotApplicable:
                            transformers.splice(currentTransformerIndex, 1);
                            break;
                        case TransformerApplicability.Applicable:
                            Log().info("    apply transformer [" + (currentTransformer.description || "No Description") + "]")
                            currentTransformer.transform(data, bindable, context);
                            transformers.splice(currentTransformerIndex, 1);
                            break;
                        case TransformerApplicability.Unknown:
                            currentTransformerIndex++;
                            break;
                    }
                }

                // transformation iteration complete

                if (transformers.length == 0){
                    // no more transformers to apply, finish transformation
                    isTransformed = true;
                }

                if (lastTransformersCount == transformers.length){
                    // no transformers were applied in the current iteration, finish transformation
                    isTransformed = true;
                }
            }
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

    JohnSmith.Common.JS.getBindableFactories = function():JohnSmith.Common.IList {
        return bindableFactories;
    }

    JohnSmith.Common.JS.getHandlerFactories = function():JohnSmith.Common.IList {
        return handlerFactories;
    }

    JohnSmith.Common.JS.getHandlerDataTransformers = function():JohnSmith.Common.IList {
        return transformersChain;
    }

    JohnSmith.Common.JS.addBindableFactory = function(factory: IBindableFactory) {
        bindableFactories.add(factory);
    }

    JohnSmith.Common.JS.addHandlerFactory = function(transformer: IHandlerFactory) {
        handlerFactories.insertAt(0, transformer);
    }

    JohnSmith.Common.JS.addHandlerTransformer = function(transformer: IHandlerDataTransformer, isImportant:bool = false){
        if (isImportant) {
            transformersChain.insertAt(0, transformer);
        } else {
            transformersChain.add(transformer);
        }
    }

    JohnSmith.Common.JS.addBindableFactory(new DefaultBindableFactory());

    JohnSmith.Common.JS.addHandlerFactory({
        createHandler: function (handler: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (handler && handler.wireWith && handler.unwireWith) {
                return handler;
            }

            return null;
        }
    });

    var bindingManager = new DefaultBindingManager(bindableFactories, handlerFactories, transformersChain);

    JohnSmith.Common.JS.ioc.register("bindingManager", bindingManager);

    JohnSmith.Common.JS.bind = function(bindable: any): JohnSmith.Binding.BindingConfig {
        return new BindingConfig(bindingManager, bindable, null);
    }
}