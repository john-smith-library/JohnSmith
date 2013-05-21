var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var Log = function () {
            return JohnSmith.Common.log;
        };
        var BindingConfig = (function () {
            function BindingConfig(manager, bindable, context) {
                this.manager = manager;
                this.bindable = bindable;
                this.context = context;
            }
            BindingConfig.prototype.to = function () {
                var handler = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    handler[_i] = arguments[_i + 0];
                }
                this.manager.bind({
                    bindableData: this.bindable,
                    handlerData: handler,
                    context: this.context
                }).init();
                return this;
            };
            return BindingConfig;
        })();
        Binding.BindingConfig = BindingConfig;        
        (function (TransformerApplicability) {
            TransformerApplicability._map = [];
            TransformerApplicability._map[0] = "NotApplicable";
            TransformerApplicability.NotApplicable = 0;
            TransformerApplicability._map[1] = "Applicable";
            TransformerApplicability.Applicable = 1;
            TransformerApplicability._map[2] = "Unknown";
            TransformerApplicability.Unknown = 2;
        })(Binding.TransformerApplicability || (Binding.TransformerApplicability = {}));
        var TransformerApplicability = Binding.TransformerApplicability;
        var BindingWire = (function () {
            function BindingWire(bindable, handler) {
                this.bindable = bindable;
                this.handler = handler;
            }
            BindingWire.prototype.init = function () {
                this.handler.wireWith(this.bindable);
            };
            BindingWire.prototype.dispose = function () {
                this.handler.unwireWith(this.bindable);
                this.handler.dispose();
            };
            BindingWire.prototype.getBindable = function () {
                return this.bindable;
            };
            BindingWire.prototype.getHandler = function () {
                return this.handler;
            };
            return BindingWire;
        })();
        Binding.BindingWire = BindingWire;        
        var DefaultBindingManager = (function () {
            function DefaultBindingManager(bindableFactories, handlerFactories, handlerDataTransformers) {
                this.bindableFactories = bindableFactories;
                this.handlerFactories = handlerFactories;
                this.handlerDataTransformers = handlerDataTransformers;
            }
            DefaultBindingManager.prototype.bind = function (data) {
                Log().info("Binding ", data.bindableData, " to ", data.handlerData);
                var bindable = this.getBindable(data.bindableData);
                var handler = this.getHandler(data.handlerData, bindable, data.context);
                Log().info("    resolved bindable: ", bindable);
                Log().info("    resolved handler: ", handler);
                var result = new BindingWire(bindable, handler);
                return result;
            };
            DefaultBindingManager.prototype.getBindable = function (bindableObject) {
                for(var i = 0; i < this.bindableFactories.count(); i++) {
                    var factory = this.bindableFactories.getAt(i);
                    var result = factory.createBindable(bindableObject);
                    if(result != null) {
                        return result;
                    }
                }
                throw new Error("Could not transform object " + bindableObject + " to bindable");
            };
            DefaultBindingManager.prototype.getHandler = function (handlerData, bindable, context) {
                this.transformHandlerData(handlerData, bindable, context);
                for(var i = 0; i < this.handlerFactories.count(); i++) {
                    var factory = this.handlerFactories.getAt(i);
                    var result = factory.createHandler(handlerData[0], context);
                    if(result) {
                        return result;
                    }
                }
                throw new Error("Could not transform object " + handlerData + " to bindable handler");
            };
            DefaultBindingManager.prototype.transformHandlerData = function (data, bindable, context) {
                if(!this.handlerDataTransformers) {
                    return;
                    Log().warn("  no transformers defined");
                }
                var transformers = [];
                for(var i = 0; i < this.handlerDataTransformers.count(); i++) {
                    transformers.push(this.handlerDataTransformers.getAt(i));
                }
                var isTransformed = false;
                var lastTransformersCount;
                while(!isTransformed) {
                    var currentTransformerIndex = 0;
                    lastTransformersCount = transformers.length;
                    while(currentTransformerIndex < transformers.length) {
                        var currentTransformer = transformers[currentTransformerIndex];
                        var applicability = currentTransformer.checkApplicability(data, bindable, context);
                        switch(applicability) {
                            case TransformerApplicability.NotApplicable:
                                transformers.splice(currentTransformerIndex, 1);
                                break;
                            case TransformerApplicability.Applicable:
                                Log().info("    apply transformer [" + (currentTransformer.description || "No Description") + "]");
                                currentTransformer.transform(data, bindable, context);
                                transformers.splice(currentTransformerIndex, 1);
                                break;
                            case TransformerApplicability.Unknown:
                                currentTransformerIndex++;
                                break;
                        }
                    }
                    if(transformers.length == 0) {
                        isTransformed = true;
                    }
                    if(lastTransformersCount == transformers.length) {
                        isTransformed = true;
                    }
                }
            };
            return DefaultBindingManager;
        })();
        Binding.DefaultBindingManager = DefaultBindingManager;        
        var DefaultBindableFactory = (function () {
            function DefaultBindableFactory() { }
            DefaultBindableFactory.prototype.createBindable = function (bindable) {
                if(bindable && bindable.getValue && bindable.addListener) {
                    return bindable;
                }
                return null;
            };
            return DefaultBindableFactory;
        })();        
        var bindableFactories = new JohnSmith.Common.ArrayList();
        var handlerFactories = new JohnSmith.Common.ArrayList();
        var transformersChain = new JohnSmith.Common.ArrayList();
        JohnSmith.Common.JS.getBindableFactories = function () {
            return bindableFactories;
        };
        JohnSmith.Common.JS.getHandlerFactories = function () {
            return handlerFactories;
        };
        JohnSmith.Common.JS.getHandlerDataTransformers = function () {
            return transformersChain;
        };
        JohnSmith.Common.JS.addBindableFactory = function (factory) {
            bindableFactories.add(factory);
        };
        JohnSmith.Common.JS.addHandlerFactory = function (transformer) {
            handlerFactories.insertAt(0, transformer);
        };
        JohnSmith.Common.JS.addHandlerTransformer = function (transformer, isImportant) {
            if (typeof isImportant === "undefined") { isImportant = false; }
            if(isImportant) {
                transformersChain.insertAt(0, transformer);
            } else {
                transformersChain.add(transformer);
            }
        };
        JohnSmith.Common.JS.addBindableFactory(new DefaultBindableFactory());
        JohnSmith.Common.JS.addHandlerFactory({
            createHandler: function (handler, context) {
                if(handler && handler.wireWith && handler.unwireWith) {
                    return handler;
                }
                return null;
            }
        });
        var bindingManager = new DefaultBindingManager(bindableFactories, handlerFactories, transformersChain);
        JohnSmith.Common.JS.ioc.register("bindingManager", bindingManager);
        JohnSmith.Common.JS.bind = function (bindable) {
            return new BindingConfig(bindingManager, bindable, null);
        };
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=BindableManager.js.map
