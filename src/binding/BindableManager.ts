/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    var Log = function(){
        return JohnSmith.Common.log;
    }

    // default implementation of binding manager
    export class DefaultBindingManager implements IBindableManager {
        private handlerFactories: JohnSmith.Common.ArrayList;
        private bindableFactories: JohnSmith.Common.ArrayList;
        private handlerArgumentProcessors: JohnSmith.Common.IList;

        constructor(
            bindableFactories:  JohnSmith.Common.ArrayList,
            handlerFactories: JohnSmith.Common.ArrayList,
            handlerArgumentProcessors: JohnSmith.Common.IList) {

            this.bindableFactories = bindableFactories;
            this.handlerFactories = handlerFactories;
            this.handlerArgumentProcessors = handlerArgumentProcessors;
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
            var lastArgument = handlerData[handlerData.length - 1];
            var handlerOptions: any;
            if (this.isOptionsArgument(lastArgument)) {
                handlerOptions = lastArgument;
                handlerData.pop();
            } else {
                handlerOptions = {};
            }

            var argumentIndex = 0;
            while (handlerData.length > 0) {
                var argument = handlerData[0];
                this.processHandlerArgument(argument, argumentIndex, handlerOptions, bindable, context);
                handlerData.splice(0, 1);
                argumentIndex++;
            }

            //this.transformHandlerData(handlerData, bindable, context);

            for (var i = 0; i < this.handlerFactories.count(); i++) {
                var factory: IHandlerFactory = this.handlerFactories.getAt(i);
                var result: IBindableHandler = factory.createHandler(handlerOptions, bindable, context);
                if (result) {
                    return result;
                }
            }

            throw new Error("Could not transform object " + handlerData + " to bindable handler");
        }

        private processHandlerArgument(argument:any, index: number, options: any, bindable:IBindable, context:JohnSmith.Common.IElement): void {
            for (var i = 0; i < this.handlerArgumentProcessors.count(); i++){
                var processor = this.handlerArgumentProcessors.getAt(i);
                if (processor.canProcess(argument, index, options, bindable, context)) {
                    processor.process(argument, options, bindable, context);
                    return;
                }
            }

            throw new Error("Could not process argument " + argument);
        }

        /**
         * Checks if the value is options object.
         * @param value
         */
        private isOptionsArgument(value: any): bool {
           return JohnSmith.Common.TypeUtils.isObject(value);
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
    var handlerArgumentProcessors:JohnSmith.Common.IList = new JohnSmith.Common.ArrayList();

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
        handlerArgumentProcessors.add(processor);
    }

    JohnSmith.Common.JS.addBindableFactory(new DefaultBindableFactory());

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
        return new BindingConfig(bindingManager, bindable, null);
    }
}