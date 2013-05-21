var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var RenderListHandler = (function () {
            function RenderListHandler(contentDestination, renderer, mapper) {
                this.contentDestination = contentDestination;
                this.valueRenderer = renderer;
                this.mapper = mapper;
            }
            RenderListHandler.prototype.wireWith = function (bindable) {
                this.doRender(bindable.getValue(), Binding.DataChangeReason.replace);
                bindable.addListener(this);
            };
            RenderListHandler.prototype.unwireWith = function (bindable) {
                bindable.removeListener(this);
            };
            RenderListHandler.prototype.valueChanged = function (oldValue, newValue, changeType) {
                this.doRender(newValue, changeType);
            };
            RenderListHandler.prototype.stateChanged = function (oldState, newState) {
            };
            RenderListHandler.prototype.dispose = function () {
                if(this.valueRenderer.dispose) {
                    this.valueRenderer.dispose();
                }
            };
            RenderListHandler.prototype.doRender = function (value, reason) {
                if(!value) {
                    return;
                }
                var items = value;
                if(reason == Binding.DataChangeReason.remove) {
                    for(var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var itemElement = this.mapper.getElementFor(item, this.contentDestination);
                        if(itemElement) {
                            itemElement.remove();
                        }
                    }
                } else if(reason == Binding.DataChangeReason.add) {
                    this.appendItems(value);
                } else {
                    this.contentDestination.empty();
                    this.appendItems(value);
                }
            };
            RenderListHandler.prototype.appendItems = function (items) {
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemElement = this.valueRenderer.render(item, this.contentDestination);
                    this.mapper.attachValueToElement(item, itemElement);
                }
            };
            return RenderListHandler;
        })();
        Binding.RenderListHandler = RenderListHandler;        
        var RenderListFactory = (function () {
            function RenderListFactory() { }
            RenderListFactory.prototype.createHandler = function (handlerData, context) {
                if(!handlerData) {
                    return null;
                }
                var options = handlerData;
                var validOptions = options.handler === "render" && options.type === "list";
                if(!validOptions) {
                    return null;
                }
                if(!options.contentDestination) {
                    throw new Error("Required option 'contentDestination' is not set!");
                }
                if(!options.renderer) {
                    throw new Error("Required option 'renderer' is not set!");
                }
                if(!options.mapper) {
                    throw new Error("Required option 'mapper' is not set!");
                }
                var handler = new RenderListHandler(options.contentDestination, options.renderer, options.mapper);
                return handler;
            };
            return RenderListFactory;
        })();
        Binding.RenderListFactory = RenderListFactory;        
        JohnSmith.Common.JS.addHandlerFactory(new RenderListFactory());
        JohnSmith.Common.JS.addHandlerTransformer({
            description: "{handler: 'render'} => {handler: 'render', type: 'list'} [Sets type to 'list']",
            checkApplicability: function (data, bindable, context) {
                if(data && data.length > 0 && data[0].handler === "render") {
                    if(data[0].type) {
                        return Binding.TransformerApplicability.NotApplicable;
                    }
                    if(bindable instanceof Binding.BindableList) {
                        return Binding.TransformerApplicability.Applicable;
                    } else if(bindable) {
                        var value = bindable.getValue();
                        if(value instanceof Array) {
                            return Binding.TransformerApplicability.Applicable;
                        }
                    }
                    return Binding.TransformerApplicability.NotApplicable;
                }
                return Binding.TransformerApplicability.Unknown;
            },
            transform: function (data, bindable, context) {
                data[0].type = 'list';
                return data;
            }
        });
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=RenderListHandler.js.map
