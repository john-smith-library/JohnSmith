/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="StaticBindableValue.ts"/>

module JohnSmith.Binding {
    var Log = function(){
        return JohnSmith.Common.log;
    }

    /**
     * Default implementation of binding manager.
     */
    export class DefaultBindingManager extends Common.ArgumentProcessorsBasedHandler implements IBindableManager {
        private _handlerFactories: JohnSmith.Common.ArrayList;
        private _bindableFactories: JohnSmith.Common.ArrayList;

        constructor(
            bindableFactories:  JohnSmith.Common.ArrayList,
            handlerFactories: JohnSmith.Common.ArrayList,
            handlerArgumentProcessors: Common.IArgumentProcessor[]) {

            super(handlerArgumentProcessors);

            this._bindableFactories = bindableFactories;
            this._handlerFactories = handlerFactories;
        }

        public bind(data:IBindingData): BindingWire {
            Log().info("Binding ", data.bindableData, " to ", data.handlerData);

            var bindable: IBindable = this.getBindable(data.bindableData);
            var handler: IBindableHandler = this.getHandler(data.handlerData, bindable, data.context, data.commandHost);

            Log().info("    resolved bindable: ", bindable);
            Log().info("    resolved handler: ", handler);

            var result: BindingWire = new BindingWire(bindable, handler);
            return result;
        }

        private getBindable(bindableObject: any): IBindable {
            for (var i = 0; i < this._bindableFactories.count(); i++) {
                var factory: JohnSmith.Binding.IBindableFactory = this._bindableFactories.getAt(i);
                var result: IBindable = factory.createBindable(bindableObject);
                if (result != null) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + bindableObject + " to bindable");
        }

        private getHandler(handlerData: any[], bindable:IBindable, context: JohnSmith.Common.IElement, commandHost:Command.ICommandHost): IBindableHandler {
            var options = this.processArguments(handlerData, context);
            for (var i = 0; i < this._handlerFactories.count(); i++) {
                var factory: IHandlerFactory = this._handlerFactories.getAt(i);
                var result: IBindableHandler = factory.createHandler(options, bindable, context, commandHost);
                if (result) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + handlerData + " to bindable handler");
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
    var handlerArgumentProcessors:Common.IArgumentProcessor[] = [];

    JohnSmith.Common.JS.getBindableFactories = function():JohnSmith.Common.IList {
        return bindableFactories;
    }

    JohnSmith.Common.JS.getHandlerFactories = function():JohnSmith.Common.IList {
        return handlerFactories;
    }

    JohnSmith.Common.JS.addBindableFactory = function(factory: IBindableFactory) {
        bindableFactories.add(factory);
    }

    JohnSmith.Common.JS.addHandlerFactory = function(transformer: IHandlerFactory) {
        handlerFactories.insertAt(0, transformer);
    }

    JohnSmith.Common.JS.addHandlerArgumentProcessor = function(processor){
        handlerArgumentProcessors.push(processor);
    }

    JohnSmith.Common.JS.addBindableFactory(new DefaultBindableFactory());
    JohnSmith.Common.JS.addBindableFactory(new StaticBindableFactory());

    JohnSmith.Common.JS.addHandlerFactory({
        createHandler: function (handler: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (handler && handler.wireWith && handler.unwireWith) {
                return <IBindableHandler> handler;
            }

            return null;
        }
    });

    var bindingManager = new DefaultBindingManager(bindableFactories, handlerFactories, handlerArgumentProcessors);

    JohnSmith.Common.JS.ioc.register("bindingManager", bindingManager);

    JohnSmith.Common.JS.bind = function(bindable: any): JohnSmith.Binding.BindingConfig {
        return new BindingConfig(bindingManager, bindable, null, Common.JS, true);
    }
}