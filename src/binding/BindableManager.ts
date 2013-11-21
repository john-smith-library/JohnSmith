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
        private _handlerFactories: IHandlerFactory[];

        constructor(
            handlerFactories: IHandlerFactory[],
            handlerArgumentProcessors: Common.IArgumentProcessor[]) {

            super(handlerArgumentProcessors);

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
            if (bindableObject && bindableObject.getValue && bindableObject.addListener) {
                return bindableObject;
            }

            return new StaticBindableValue(bindableObject);

//            for (var i = 0; i < this._bindableFactories.length; i++) {
//                var factory: JohnSmith.Binding.IBindableFactory = this._bindableFactories[i];
//                var result: IBindable = factory.createBindable(bindableObject);
//                if (result != null) {
//                    return result;
//                }
//            }
//
//            throw new Error("Could not transform object " + bindableObject + " to bindable");
        }

        private getHandler(handlerData: any[], bindable:IBindable, context: JohnSmith.Common.IElement, commandHost:Command.ICommandHost): IBindableHandler {
            var options = this.processArguments(handlerData, context);
            for (var i = 0; i < this._handlerFactories.length; i++) {
                var factory: IHandlerFactory = this._handlerFactories[i];
                var result: IBindableHandler = factory.createHandler(options, bindable, context, commandHost);
                if (result) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + handlerData + " to bindable handler");
        }
    }

    /*
    class DefaultBindableFactory implements IBindableFactory {
        public createBindable(bindable: any): IBindable {
            if (bindable && bindable.getValue && bindable.addListener) {
                return bindable;
            }

            return null;
        }
    }*/

    var handlerFactories:IHandlerFactory[] = [];
    var handlerArgumentProcessors:Common.IArgumentProcessor[] = [];

    JohnSmith.Common.JS.getHandlerFactories = function():IHandlerFactory[] {
        return handlerFactories;
    }

    JohnSmith.Common.JS.addHandlerFactory = function(transformer: IHandlerFactory) {
        // todo insert?
        handlerFactories.push(transformer);
    }

    JohnSmith.Common.JS.addHandlerArgumentProcessor = function(processor){
        handlerArgumentProcessors.push(processor);
    }

    JohnSmith.Common.JS.addHandlerFactory({
        createHandler: function (handler: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (handler && handler.wireWith && handler.unwireWith) {
                return <IBindableHandler> handler;
            }

            return null;
        }
    });

    var bindingManager = new DefaultBindingManager(handlerFactories, handlerArgumentProcessors);

    JohnSmith.Common.JS.ioc.register("bindingManager", bindingManager);

    JohnSmith.Common.JS.bind = function(bindable: any): JohnSmith.Binding.BindingConfig {
        return new BindingConfig(bindingManager, bindable, null, Common.JS, true);
    }
}