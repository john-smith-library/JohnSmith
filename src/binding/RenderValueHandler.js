var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var RenderValueHandler = (function () {
            function RenderValueHandler(contentDestination, renderer) {
                this.contentDestination = contentDestination;
                this.valueRenderer = renderer;
            }
            RenderValueHandler.prototype.wireWith = function (bindable) {
                this.doRender(bindable.getValue());
                bindable.addListener(this);
            };
            RenderValueHandler.prototype.unwireWith = function (bindable) {
                bindable.removeListener(this);
            };
            RenderValueHandler.prototype.valueChanged = function (oldValue, newValue, changeType) {
                this.doRender(newValue);
            };
            RenderValueHandler.prototype.stateChanged = function (oldState, newState) {
            };
            RenderValueHandler.prototype.dispose = function () {
                if(this.valueRenderer.dispose) {
                    this.valueRenderer.dispose();
                }
            };
            RenderValueHandler.prototype.doRender = function (value) {
                this.contentDestination.empty();
                if(value) {
                    this.valueRenderer.render(value, this.contentDestination);
                }
                ;
            };
            return RenderValueHandler;
        })();
        Binding.RenderValueHandler = RenderValueHandler;        
        var RenderValueFactory = (function () {
            function RenderValueFactory() { }
            RenderValueFactory.prototype.createHandler = function (handlerData, context) {
                if(!handlerData) {
                    return null;
                }
                var options = handlerData;
                var validOptions = options.handler === "render" && options.type === "value";
                if(!validOptions) {
                    return null;
                }
                if(!options.contentDestination) {
                    throw new Error("Required option 'contentDestination' is not set!");
                }
                if(!options.renderer) {
                    throw new Error("Required option 'renderer' is not set!");
                }
                var handler = new RenderValueHandler(options.contentDestination, options.renderer);
                return handler;
            };
            return RenderValueFactory;
        })();
        Binding.RenderValueFactory = RenderValueFactory;        
        JohnSmith.Common.JS.addHandlerFactory(new RenderValueFactory());
        JohnSmith.Common.JS.addHandlerTransformer({
            description: "{} => {handler: 'render'} [Sets handler to 'render' if it is not set]",
            checkApplicability: function (data, bindable, context) {
                if(data && data.length > 0) {
                    if(data[0].handler) {
                        return Binding.TransformerApplicability.NotApplicable;
                    }
                    if(typeof data[0] === "object") {
                        return Binding.TransformerApplicability.Applicable;
                    }
                }
                return Binding.TransformerApplicability.Unknown;
            },
            transform: function (data, bindable, context) {
                data[0].handler = "render";
                return data;
            }
        });
        JohnSmith.Common.JS.addHandlerTransformer({
            description: "{handler: 'render'} => {handler: 'render', type: 'value'} [Sets type to 'value']",
            checkApplicability: function (data, bindable, context) {
                if(data && data.length > 0 && data[0].handler === "render") {
                    if(data[0].type) {
                        return Binding.TransformerApplicability.NotApplicable;
                    }
                    if(bindable instanceof Binding.BindableList) {
                        return Binding.TransformerApplicability.NotApplicable;
                    } else if(bindable) {
                        var value = bindable.getValue();
                        if(value instanceof Array) {
                            return Binding.TransformerApplicability.NotApplicable;
                        }
                    }
                    return Binding.TransformerApplicability.Applicable;
                }
                return Binding.TransformerApplicability.Unknown;
            },
            transform: function (data, bindable, context) {
                data[0].type = 'value';
                return data;
            }
        });
        JohnSmith.Common.JS.addHandlerTransformer({
            description: "{handler: 'render'} => {formatter: IValueFormatter} [Sets default formatter]",
            checkApplicability: function (data, bindable, context) {
                if(data && data.length > 0) {
                    if(data[0].renderer || data[0].formatter) {
                        return Binding.TransformerApplicability.NotApplicable;
                    }
                    if(data[0].handler === "render") {
                        return Binding.TransformerApplicability.Applicable;
                    }
                }
                return Binding.TransformerApplicability.Unknown;
            },
            transform: function (data, bindable, context) {
                data[0].formatter = {
                    format: function (value) {
                        if(value == null) {
                            return null;
                        }
                        return value.toString();
                    }
                };
                return data;
            }
        });
        JohnSmith.Common.JS.addHandlerTransformer({
            description: "{formatter: IValueFormatter} => {renderer: IValueRenderer} [Converts value formatter to value renderer]",
            checkApplicability: function (data, bindable, context) {
                if(data && data.length > 0) {
                    if(data[0].renderer) {
                        return Binding.TransformerApplicability.NotApplicable;
                    }
                    if(data[0].handler === "render" && data[0].formatter) {
                        return Binding.TransformerApplicability.Applicable;
                    }
                }
                return Binding.TransformerApplicability.Unknown;
            },
            transform: function (data, bindable, context) {
                var formatter = data[0].formatter;
                data[0].renderer = {
                    render: function (value, destination) {
                        var formattedValue = formatter.format(value);
                        var result = destination.append(formattedValue);
                        JohnSmith.Common.JS.event.bus.trigger("valueRendered", {
                            originalValue: value,
                            formattedValue: formattedValue,
                            root: result,
                            destination: destination
                        });
                        return result;
                    }
                };
                if(formatter.dispose) {
                    data[0].renderer.dispose = function () {
                        formatter.dispose;
                    };
                }
                return data;
            }
        });
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=RenderValueHandler.js.map
