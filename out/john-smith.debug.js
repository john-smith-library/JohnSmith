var js = js || {
};
var JohnSmith;
(function (JohnSmith) {
    (function (Common) {
        var ArrayList = (function () {
            function ArrayList() {
                this.items = [];
            }
            ArrayList.prototype.getAt = function (index) {
                return this.items[index];
            };
            ArrayList.prototype.setAt = function (index, item) {
                this.items[index] = item;
            };
            ArrayList.prototype.removeAt = function (index) {
                this.items.splice(index, 1);
            };
            ArrayList.prototype.insertAt = function (index, item) {
                this.items.splice(index, 0, item);
            };
            ArrayList.prototype.add = function (item) {
                this.items.push(item);
            };
            ArrayList.prototype.count = function () {
                return this.items.length;
            };
            ArrayList.prototype.clear = function () {
                this.items.length = 0;
            };
            return ArrayList;
        })();
        Common.ArrayList = ArrayList;        
        // Using no-op logger by default
        Common.log = {
            info: function (message) {
            },
            warn: function (message) {
            },
            error: function (message) {
            }
        };
        var ioc = {
            resolve: function (key) {
                return this[key];
            },
            register: function (key, service) {
                this[key] = service;
            }
        };
        js.ioc = ioc;
    })(JohnSmith.Common || (JohnSmith.Common = {}));
    var Common = JohnSmith.Common;
})(JohnSmith || (JohnSmith = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JohnSmith;
(function (JohnSmith) {
    /// <reference path="Common.ts"/>
    (function (Binding) {
        /////////////////////////////////
        // Common Enums
        /////////////////////////////////
        (function (DataChangeReason) {
            DataChangeReason._map = [];
            DataChangeReason._map[0] = "replace";
            DataChangeReason.replace = 0;
            DataChangeReason._map[1] = "add";
            DataChangeReason.add = 1;
            DataChangeReason._map[2] = "remove";
            DataChangeReason.remove = 2;
        })(Binding.DataChangeReason || (Binding.DataChangeReason = {}));
        var DataChangeReason = Binding.DataChangeReason;
        // stores a combination of bindable and handler
        var BindingWire = (function () {
            function BindingWire(bindable, handler) {
                this.bindable = bindable;
                this.handler = handler;
            }
            BindingWire.prototype.init = // initializes the wire
            function () {
                this.handler.wireWith(this.bindable);
            };
            BindingWire.prototype.dispose = // disposes the wire
            function () {
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
        /// Simple bindable value.
        var BindableValue = (function () {
            function BindableValue() {
                this.listeners = new JohnSmith.Common.ArrayList();
            }
            BindableValue.prototype.getValue = function () {
                return this.value;
            };
            BindableValue.prototype.setValue = function (value) {
                this.notifyListeners(value, DataChangeReason.replace);
                this.value = value;
            };
            BindableValue.prototype.getState = function () {
                return this.state;
            };
            BindableValue.prototype.setState = function (state) {
                for(var i = 0; i < this.listeners.count(); i++) {
                    var listener = this.listeners.getAt(i);
                    listener.stateChanged(this.state, state);
                }
                this.state = state;
            };
            BindableValue.prototype.addListener = function (listener) {
                this.listeners.add(listener);
            };
            BindableValue.prototype.removeListener = function (listener) {
                var indexToRemove = -1;
                for(var i = 0; i < this.listeners.count(); i++) {
                    if(this.listeners.getAt(i) == listener) {
                        indexToRemove = i;
                    }
                }
                if(indexToRemove >= 0) {
                    this.listeners.removeAt(indexToRemove);
                }
            };
            BindableValue.prototype.getListenersCount = function () {
                return this.listeners.count();
            };
            BindableValue.prototype.notifyListeners = function (newValue, reason) {
                for(var i = 0; i < this.listeners.count(); i++) {
                    var listener = this.listeners.getAt(i);
                    listener.valueChanged(this.value, newValue, reason);
                }
            };
            return BindableValue;
        })();
        Binding.BindableValue = BindableValue;        
        var BindableList = (function (_super) {
            __extends(BindableList, _super);
            /*, JohnSmith.Common.IList*/ function BindableList() {
                        _super.call(this);
                _super.prototype.setValue.call(this, []);
            }
            BindableList.prototype.setValue = function (value) {
                if(value) {
                    if(!(value instanceof Array)) {
                        throw new Error("Bindable list supports only array values");
                    }
                }
                _super.prototype.setValue.call(this, value);
            };
            BindableList.prototype.add = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var array = this.getValue();
                for(var i = 0; i < args.length; i++) {
                    array.push(args[i]);
                }
                _super.prototype.notifyListeners.call(this, args, DataChangeReason.add);
            };
            BindableList.prototype.remove = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var array = this.getValue();
                for(var i = 0; i < args.length; i++) {
                    var indexToRemove = -1;
                    for(var j = 0; j < array.length; j++) {
                        if(array[j] == args[i]) {
                            indexToRemove = j;
                        }
                    }
                    if(indexToRemove >= 0) {
                        array.splice(indexToRemove, 1);
                    }
                }
                _super.prototype.notifyListeners.call(this, args, DataChangeReason.remove);
            };
            return BindableList;
        })(BindableValue);
        Binding.BindableList = BindableList;        
        var StaticBindableValue = (function () {
            function StaticBindableValue(value) {
                this.value = value;
            }
            StaticBindableValue.prototype.getValue = function () {
                return this.value;
            };
            StaticBindableValue.prototype.getState = function () {
                return "normal";
            };
            StaticBindableValue.prototype.addListener = function (listener) {
            };
            StaticBindableValue.prototype.removeListener = function (listener) {
            };
            return StaticBindableValue;
        })();
        Binding.StaticBindableValue = StaticBindableValue;        
        // default implementation of binding manager
        var DefaultBindingManager = (function () {
            function DefaultBindingManager(bindableFactories, handlerFactories, handlerDataTransformers) {
                this.bindableFactories = bindableFactories;
                this.handlerFactories = handlerFactories;
                this.handlerDataTransformers = handlerDataTransformers;
            }
            DefaultBindingManager.prototype.bind = function (bindable, handler, context) {
                var bindable = this.getBindable(bindable);
                var handler = this.getHandler(handler, context);
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
            DefaultBindingManager.prototype.getHandler = function (handlerObject, context) {
                var data = handlerObject;
                for(var i = 0; i < this.handlerDataTransformers.count(); i++) {
                    data = this.handlerDataTransformers.getAt(i).transform(data);
                    JohnSmith.Common.log.info(data);
                }
                for(var i = 0; i < this.handlerFactories.count(); i++) {
                    var factory = this.handlerFactories.getAt(i);
                    var result = factory.createHandler(data, context);
                    if(result) {
                        return result;
                    }
                }
                throw new Error("Could not transform object " + handlerObject + " to bindable handler");
            };
            return DefaultBindingManager;
        })();
        Binding.DefaultBindingManager = DefaultBindingManager;        
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
                this.valueRenderer.render(value, this.contentDestination);
            };
            return RenderValueHandler;
        })();
        Binding.RenderValueHandler = RenderValueHandler;        
        var RenderListHandler = (function () {
            function RenderListHandler(contentDestination, formatter) {
                this.contentDestination = contentDestination;
                this.valueFormatter = formatter;
            }
            RenderListHandler.prototype.wireWith = function (bindable) {
                this.doRender(bindable.getValue(), DataChangeReason.replace);
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
                if(this.valueFormatter.dispose) {
                    this.valueFormatter.dispose();
                }
            };
            RenderListHandler.prototype.doRender = function (value, reason) {
                if(!value) {
                    return;
                }
                var items = value;
                if(reason == DataChangeReason.remove) {
                    for(var i = 0; i < items.length; i++) {
                        var item = items[i];
                        this.contentDestination.remove(item);
                    }
                } else if(reason == DataChangeReason.add) {
                    this.appendItems(value);
                } else {
                    this.contentDestination.empty();
                    this.appendItems(value);
                }
            };
            RenderListHandler.prototype.appendItems = function (items) {
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var formattedValue = this.valueFormatter.format(item);
                    this.contentDestination.append(item, formattedValue);
                }
            };
            return RenderListHandler;
        })();
        Binding.RenderListHandler = RenderListHandler;        
        var StateTransitionHandler = (function () {
            function StateTransitionHandler() {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.items = new JohnSmith.Common.ArrayList();
                for(var i = 0; i < args.length; i++) {
                    this.items.add(args[i]);
                }
            }
            StateTransitionHandler.prototype.wireWith = function (bindable) {
                bindable.addListener(this);
            };
            StateTransitionHandler.prototype.unwireWith = function (bindable) {
                bindable.removeListener(this);
            };
            StateTransitionHandler.prototype.valueChanged = function (oldValue, newValue, changeType) {
            };
            StateTransitionHandler.prototype.stateChanged = function (oldState, newState) {
                for(var i = 0; i < this.items.count(); i++) {
                    var item = this.items.getAt(i);
                    if(item.isMatched(oldState, newState)) {
                        item.handle(oldState, newState);
                    }
                }
            };
            StateTransitionHandler.prototype.dispose = function () {
                this.items.clear();
            };
            return StateTransitionHandler;
        })();
        Binding.StateTransitionHandler = StateTransitionHandler;        
        var RenderValueFactory = (function () {
            function RenderValueFactory() { }
            RenderValueFactory.prototype.createHandler = function (handler, context) {
                if(!handler) {
                    return null;
                }
                var options = handler;
                if((!options.handler) || (options.handler != "render")) {
                    return null;
                }
                if(!options.contentDestination) {
                    throw new Error("Required option 'contentDestination' is not set!");
                }
                if(!options.renderer) {
                    throw new Error("Required option 'renderer' is not set!");
                }
                //            if (options.valueFormatter == null) {
                //                options.valueFormatter = {
                //                    format: function (value: any): string {
                //                        return value;
                //                    }
                //                }
                //            }
                var handler = new RenderValueHandler(options.contentDestination, options.renderer);
                return handler;
            };
            return RenderValueFactory;
        })();
        Binding.RenderValueFactory = RenderValueFactory;        
        var RenderListFactory = (function () {
            function RenderListFactory() { }
            RenderListFactory.prototype.createHandler = function (handler, context) {
                if(!handler) {
                    return null;
                }
                var options = handler;
                if((!options.handler) || (options.handler != "list")) {
                    return null;
                }
                if(options.valueFormatter == null) {
                    options.valueFormatter = {
                        format: function (value) {
                            return value;
                        }
                    };
                }
                var handler = new RenderListHandler(options.contentDestination, options.valueFormatter);
                return handler;
            };
            return RenderListFactory;
        })();
        Binding.RenderListFactory = RenderListFactory;        
        /////////////////////////////////
        // Config
        /////////////////////////////////
        var BindingConfig = (function () {
            function BindingConfig(manager, bindable, context) {
                this.manager = manager;
                this.bindable = bindable;
                this.context = context;
            }
            BindingConfig.prototype.to = function (handler) {
                this.manager.bind(this.bindable, handler, this.context).init();
                return this;
            };
            return BindingConfig;
        })();
        Binding.BindingConfig = BindingConfig;        
        var StaticBindableFactory = (function () {
            function StaticBindableFactory() { }
            StaticBindableFactory.prototype.createBindable = function (bindable) {
                return new StaticBindableValue(bindable);
            };
            return StaticBindableFactory;
        })();        
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
        /* Configure handlers */
        handlerFactories.add(new RenderListFactory());
        handlerFactories.add(new RenderValueFactory());
        handlerFactories.add({
            createHandler: function (handler, context) {
                if(handler && handler.wireWith && handler.unwireWith) {
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
        js.getBindableFactories = function () {
            return bindableFactories;
        };
        js.getHandlerFactories = function () {
            return handlerFactories;
        };
        js.getHandlerDataTransformers = function () {
            return transformersChain;
        };
        js.addHandlerFactory = function (transformer) {
            handlerFactories.insertAt(0, transformer);
        };
        js.addHandlerTransformer = function (transformer, isImportant) {
            if (typeof isImportant === "undefined") { isImportant = false; }
            if(isImportant) {
                transformersChain.insertAt(0, transformer);
            } else {
                transformersChain.add(transformer);
            }
        };
        js.bindableValue = function () {
            return new BindableValue();
        };
        js.bindableList = function () {
            return new BindableList();
        };
        js.bind = function (bindable) {
            return new BindingConfig(bindingManager, bindable, null);
        };
        js.addHandlerTransformer({
            description: "{} => {handler: 'render'} [Sets handler to 'render' if it is not set]",
            transform: function (data, context) {
                if(data && typeof data === "object") {
                    if(!data.handler) {
                        data.handler = "render";
                    }
                }
                return data;
            }
        });
        js.addHandlerTransformer({
            description: "{handler: 'render'} => {formatter: IValueFormatter} [Sets default formatter]",
            transform: function (data, context) {
                if(data && typeof data === "object" && data.handler && data.handler === "render") {
                    if((!data.formatter) && (!data.renderer)) {
                        data.formatter = {
                            format: function (value) {
                                return value;
                            }
                        };
                    }
                }
                return data;
            }
        });
        js.addHandlerTransformer({
            description: "{formatter: IValueFormatter} => {renderer: IValueRenderer} [Converts value formatter to value renderer]",
            transform: function (data, context) {
                if(data && typeof data === "object" && data.handler && data.handler === "render") {
                    if(data.formatter && (!data.renderer)) {
                        var formatter = data.formatter;
                        data.renderer = {
                            render: function (value, destination) {
                                destination.empty();
                                destination.append(formatter.format(value));
                            }
                        };
                        if(formatter.dispose) {
                            data.renderer.dispose = function () {
                                formatter.dispose;
                            };
                        }
                    }
                }
                return data;
            }
        });
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    /// <reference path="Binding.ts"/>
    (function (Views) {
        var DefaultView = (function () {
            function DefaultView(bindableManager, elementFactory, templateQuery, initCallback, viewModel) {
                this.bindableManager = bindableManager;
                this.elementFactory = elementFactory;
                this.templateQuery = templateQuery;
                this.initCallback = initCallback;
                this.viewModel = viewModel;
            }
            DefaultView.prototype.renderTo = function (destination) {
                var templateElement = this.elementFactory.createElement(this.templateQuery);
                var destinationElement = typeof destination == "string" ? this.elementFactory.createElement(destination) : destination;
                var templateHtml = templateElement.getHtml();
                destinationElement.empty();
                this.rootElement = destinationElement.append(templateHtml);
                this.initCallback(this, this.viewModel);
                if(this.viewModel.resetState) {
                    this.viewModel.resetState();
                }
            };
            DefaultView.prototype.bind = function (bindable) {
                return new JohnSmith.Binding.BindingConfig(this.bindableManager, bindable, this.rootElement);
            };
            DefaultView.prototype.dispose = function () {
                // todo implement
                            };
            return DefaultView;
        })();
        Views.DefaultView = DefaultView;        
        var ViewValueRenderer = (function () {
            function ViewValueRenderer(viewFactory) {
                this.viewFactory = viewFactory;
            }
            ViewValueRenderer.prototype.render = function (value, destination) {
                if(this.currentView) {
                    this.currentView.dispose();
                }
                if(!value) {
                    return;
                }
                this.currentView = this.viewFactory(value);
                this.currentView.renderTo(destination);
            };
            ViewValueRenderer.prototype.dispose = function () {
                if(this.currentView) {
                    this.currentView.dispose();
                }
            };
            return ViewValueRenderer;
        })();
        Views.ViewValueRenderer = ViewValueRenderer;        
        /////////////////////////////////
        // Config
        /////////////////////////////////
        js.addHandlerTransformer({
            description: "{view: Function} => {renderer: IValueRenderer} [Sets renderer for view]",
            transform: function (data, context) {
                if(data && data.handler === "render" && data.view) {
                    data.renderer = new ViewValueRenderer(data.view);
                }
                return data;
            }
        });
        js.createView = function (templateQuery, initCallback, viewModel) {
            return new DefaultView(js.ioc.resolve("bindingManager"), js.ioc.resolve("elementFactory"), templateQuery, initCallback, viewModel);
        };
    })(JohnSmith.Views || (JohnSmith.Views = {}));
    var Views = JohnSmith.Views;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (JQuery) {
        var JQueryBindableHandlerTransformer = (function () {
            function JQueryBindableHandlerTransformer() { }
            JQueryBindableHandlerTransformer.prototype.createHandler = function (handler, context) {
                var elementFactory = js.ioc.resolve("elementFactory");
                //            if (typeof handler == "string") {
                //                return new JohnSmith.Binding.HandlerFactoryResult(
                //                    null, {
                //                        handler: "render",
                //                        contentDestination: context == null ?
                //                            elementFactory.createElement(handler) :
                //                            context.findRelative(handler)
                //                    });
                //            }
                //            if (handler && handler.handler && handler.to && (handler.handler == "render")) {
                //                handler.contentDestination = context == null ?
                //                    elementFactory.createElement(handler.to) :
                //                    context.findRelative(handler.to);
                //
                //                return null;
                //            }
                if(handler && handler.handler && handler.to && handler.handler == "list") {
                    var contentDestination = {
                        empty: function () {
                            $(handler.to).empty();
                        },
                        append: function (item, html) {
                            $(html).data("dataItem", item).addClass("dataItem").appendTo($(handler.to));
                        },
                        remove: function (item) {
                            var elementsToDelete = [];
                            $(handler.to).find(".dataItem").each(function (index, element) {
                                var $element = $(element);
                                if($element.data("dataItem") == item) {
                                    elementsToDelete.push($element);
                                }
                            });
                            for(var i = 0; i < elementsToDelete.length; i++) {
                                elementsToDelete[i].remove();
                            }
                        }
                    };
                    handler.contentDestination = contentDestination;
                    return null;
                }
                return null;
            };
            return JQueryBindableHandlerTransformer;
        })();
        JQuery.JQueryBindableHandlerTransformer = JQueryBindableHandlerTransformer;        
        var JQueryElement = (function () {
            function JQueryElement(target) {
                this.target = target;
            }
            JQueryElement.prototype.empty = function () {
                this.target.empty();
            };
            JQueryElement.prototype.append = function (html) {
                var parseHTML = $($.parseHTML(html));
                this.target.append(parseHTML);
                return new JQueryElement(parseHTML);
            };
            JQueryElement.prototype.getHtml = function () {
                return this.target.html();
            };
            JQueryElement.prototype.findRelative = function (query) {
                var result = this.target.filter(query);
                if(result.length == 0) {
                    result = this.target.find(query);
                }
                return new JQueryElement(result);
            };
            return JQueryElement;
        })();        
        /////////////////////////////////
        // Configuring handler transformers
        /////////////////////////////////
        js.addHandlerTransformer({
            description: "{to: 'selector'} => {contentDestination: IElement} [Converts 'to' selector to DOM element]",
            transform: function (data, context) {
                if(data && data.handler && data.handler === "render" && data.to) {
                    var elementFactory = js.ioc.resolve("elementFactory");
                    data.contentDestination = context == null ? elementFactory.createElement(data.to) : context.findRelative(data.to);
                }
                return data;
            }
        }, true);
        js.addHandlerTransformer({
            description: "'selector' => {to: 'selector', handler: 'render'} [Handles selector and converts it to object with 'to' property]",
            transform: function (data, context) {
                if(typeof data == "string") {
                    return {
                        to: data,
                        handler: 'render'
                    };
                }
                return data;
            }
        }, true);
        /////////////////////////////////
        // Configuring handler factories
        /////////////////////////////////
        js.addHandlerFactory(new JohnSmith.JQuery.JQueryBindableHandlerTransformer());
        /////////////////////////////////
        // Configuring ioc dependencies
        /////////////////////////////////
        js.ioc.register("elementFactory", {
            createElement: function (query) {
                return new JQueryElement($(query));
            },
            createRelativeElement: function (parent, query) {
            }
        });
    })(JohnSmith.JQuery || (JohnSmith.JQuery = {}));
    var JQuery = JohnSmith.JQuery;
})(JohnSmith || (JohnSmith = {}));
/// <reference path="Common.ts"/>
// Replace no-op logger with console-based implementation
JohnSmith.Common.log = {
    info: function (message) {
        console.log(message);
    },
    warn: function (message) {
        console.warn(message);
    },
    error: function (message) {
        console.error(message);
    }
};
// Dump current configuration
//$(function(){
var log = JohnSmith.Common.log;
log.info("== John Smith started ==");
log.info("  Configuration details:");
log.info("    Handler data transformers:");
var handlerDataTransformers = js.getHandlerDataTransformers();
for(var i = 0; i < handlerDataTransformers.count(); i++) {
    log.info("      - [" + i + "] " + (handlerDataTransformers.getAt(i).description || "No description"));
}
//});
