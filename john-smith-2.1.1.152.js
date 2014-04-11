var JohnSmith;
(function (JohnSmith) {
    (function (Common) {
        var TypeUtils = (function () {
            function TypeUtils() {
            }
            TypeUtils.isFunction = function (target) {
                var getType = {};
                return (target && getType.toString.call(target) === '[object Function]');
            };

            TypeUtils.isObject = function (target) {
                return target != null && typeof target === "object";
            };
            return TypeUtils;
        })();
        Common.TypeUtils = TypeUtils;

        var ArrayUtils = (function () {
            function ArrayUtils() {
            }
            ArrayUtils.removeItem = function (array, itemToRemove) {
                var indexToRemove = -1;
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === itemToRemove) {
                        indexToRemove = i;
                    }
                }

                if (indexToRemove >= 0) {
                    array.splice(indexToRemove, 1);
                }
            };
            return ArrayUtils;
        })();
        Common.ArrayUtils = ArrayUtils;

        

        var ArgumentProcessorsBasedHandler = (function () {
            function ArgumentProcessorsBasedHandler(processors) {
                this._processors = processors;
            }
            ArgumentProcessorsBasedHandler.prototype.processArguments = function (args, context) {
                var lastArgument = args[args.length - 1];
                var options;
                if (this.isOptionsArgument(lastArgument)) {
                    options = lastArgument;
                    args.pop();
                } else {
                    options = {};
                }

                var argumentIndex = 0;
                while (args.length > 0) {
                    var argument = args[0];
                    this.processHandlerArgument(argument, argumentIndex, options, context);
                    args.splice(0, 1);
                    argumentIndex++;
                }

                return options;
            };

            ArgumentProcessorsBasedHandler.prototype.processHandlerArgument = function (argument, index, options, context) {
                for (var i = 0; i < this._processors.length; i++) {
                    var processor = this._processors[i];
                    if (processor.canProcess(argument, index, options, context)) {
                        processor.process(argument, options, context);
                        return;
                    }
                }

                throw new Error("Could not process argument " + argument);
            };

            ArgumentProcessorsBasedHandler.prototype.isOptionsArgument = function (value) {
                return JohnSmith.Common.TypeUtils.isObject(value);
            };
            return ArgumentProcessorsBasedHandler;
        })();
        Common.ArgumentProcessorsBasedHandler = ArgumentProcessorsBasedHandler;

        

        Common.log = {
            info: function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
            },
            warn: function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
            },
            error: function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
            }
        };

        

        var DefaultEventBus = (function () {
            function DefaultEventBus() {
                this._listeners = [];
            }
            DefaultEventBus.prototype.addListener = function (eventType, callback) {
                var listener = {
                    eventType: eventType,
                    callback: callback
                };

                this._listeners.push(listener);
            };

            DefaultEventBus.prototype.trigger = function (eventType, data) {
                var listenersCount = this._listeners.length;
                for (var i = 0; i < listenersCount; i++) {
                    var listener = this._listeners[i];
                    if (listener.eventType === eventType) {
                        listener.callback(data);
                    }
                }
            };
            return DefaultEventBus;
        })();
        Common.DefaultEventBus = DefaultEventBus;

        var ValueType = (function () {
            function ValueType() {
            }
            ValueType.text = "text";

            ValueType.html = "html";

            ValueType.unknown = "unknown";
            return ValueType;
        })();
        Common.ValueType = ValueType;

        
    })(JohnSmith.Common || (JohnSmith.Common = {}));
    var Common = JohnSmith.Common;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Command) {
        var CommandWire = (function () {
            function CommandWire(command, cause) {
                this._command = command;
                this._cause = cause;
            }
            CommandWire.prototype.init = function () {
                this._cause.wireWith(this._command);
            };

            CommandWire.prototype.dispose = function () {
                this._cause.dispose();
            };
            return CommandWire;
        })();
        Command.CommandWire = CommandWire;

        var CommandConfig = (function () {
            function CommandConfig(causeData, commandManager, context, commandContext) {
                this._causeData = causeData;
                this._commandManager = commandManager;
                this._context = context;
                this._commandContext = commandContext;
                this._wires = [];
            }
            CommandConfig.prototype.react = function (command, commandContext) {
                var wire = this._commandManager.setUpBinding({
                    command: command,
                    context: this._context,
                    causeData: this._causeData,
                    commandContext: commandContext || this._commandContext || null
                });

                this._wires.push(wire);

                wire.init();
                return this;
            };

            CommandConfig.prototype.dispose = function () {
                for (var i = 0; i < this._wires.length; i++) {
                    this._wires[i].dispose();
                }
            };
            return CommandConfig;
        })();
        Command.CommandConfig = CommandConfig;
    })(JohnSmith.Command || (JohnSmith.Command = {}));
    var Command = JohnSmith.Command;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        (function (DataChangeReason) {
            DataChangeReason[DataChangeReason["replace"] = 0] = "replace";
            DataChangeReason[DataChangeReason["add"] = 1] = "add";
            DataChangeReason[DataChangeReason["remove"] = 2] = "remove";
        })(Binding.DataChangeReason || (Binding.DataChangeReason = {}));
        var DataChangeReason = Binding.DataChangeReason;

        

        

        

        var BindingWire = (function () {
            function BindingWire(bindable, handler) {
                this._bindable = bindable;
                this._handler = handler;
            }
            BindingWire.prototype.init = function () {
                this._handler.wireWith(this._bindable);
            };

            BindingWire.prototype.dispose = function () {
                this._handler.unwireWith(this._bindable);
                this._handler.dispose();
            };

            BindingWire.prototype.getBindable = function () {
                return this._bindable;
            };

            BindingWire.prototype.getHandler = function () {
                return this._handler;
            };
            return BindingWire;
        })();
        Binding.BindingWire = BindingWire;

        

        var BindingConfig = (function () {
            function BindingConfig(manager, bindable, context, commandHost, initImmediately) {
                this._manager = manager;
                this._bindable = bindable;
                this._context = context;
                this._commandHost = commandHost;
                this._wires = [];
                this._initImmediately = initImmediately;
            }
            BindingConfig.prototype.to = function () {
                var handler = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    handler[_i] = arguments[_i + 0];
                }
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
            };

            BindingConfig.prototype.init = function () {
                for (var i = 0; i < this._wires.length; i++) {
                    this._wires[i].init();
                }
            };

            BindingConfig.prototype.dispose = function () {
                for (var i = 0; i < this._wires.length; i++) {
                    this._wires[i].dispose();
                }
            };
            return BindingConfig;
        })();
        Binding.BindingConfig = BindingConfig;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var BindableValue = (function () {
            function BindableValue() {
                this._listeners = [];
            }
            BindableValue.prototype.getValue = function () {
                return this._value;
            };

            BindableValue.prototype.setValue = function (value) {
                this.notifyListeners(value, 0 /* replace */);
                this._value = value;
            };

            BindableValue.prototype.addListener = function (listener) {
                this._listeners.push(listener);
            };

            BindableValue.prototype.removeListener = function (listener) {
                var indexToRemove = -1;
                for (var i = 0; i < this._listeners.length; i++) {
                    if (this._listeners[i] == listener) {
                        indexToRemove = i;
                    }
                }

                if (indexToRemove >= 0) {
                    this._listeners.splice(indexToRemove, 1);
                }
            };

            BindableValue.prototype.getListenersCount = function () {
                return this._listeners.length;
            };

            BindableValue.prototype.getListener = function (index) {
                return this._listeners[index];
            };

            BindableValue.prototype.notifyListeners = function (newValue, reason) {
                for (var i = 0; i < this._listeners.length; i++) {
                    var listener = this._listeners[i];
                    listener.valueChanged(this._value, newValue, reason);
                }
            };

            BindableValue.prototype.hasValue = function () {
                if (this._value == null || this._value == undefined) {
                    return false;
                }

                return true;
            };
            return BindableValue;
        })();
        Binding.BindableValue = BindableValue;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var BindableList = (function (_super) {
            __extends(BindableList, _super);
            function BindableList() {
                _super.call(this);
                _super.prototype.setValue.call(this, []);
            }
            BindableList.prototype.setValue = function (value) {
                if (value) {
                    if (!(value instanceof Array)) {
                        throw new Error("Bindable list supports only array values");
                    }
                }

                _super.prototype.setValue.call(this, value);
                this.notifyCountListeners();
            };

            BindableList.prototype.add = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var array = this.getValue();
                for (var i = 0; i < args.length; i++) {
                    array.push(args[i]);
                }

                this.reactOnChange(args, 1 /* add */);
            };

            BindableList.prototype.remove = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var array = this.getValue();
                for (var i = 0; i < args.length; i++) {
                    var indexToRemove = -1;
                    for (var j = 0; j < array.length; j++) {
                        if (array[j] == args[i]) {
                            indexToRemove = j;
                        }
                    }

                    if (indexToRemove >= 0) {
                        array.splice(indexToRemove, 1);
                    }
                }

                this.reactOnChange(args, 2 /* remove */);
            };

            BindableList.prototype.clear = function () {
                var removed = this.getValue().splice(0, this.getValue().length);
                this.reactOnChange(removed, 2 /* remove */);
            };

            BindableList.prototype.count = function () {
                if (!this._count) {
                    this._count = new JohnSmith.Binding.BindableValue();
                }

                return this._count;
            };

            BindableList.prototype.forEach = function (callback, thisArg) {
                var array = this.getValue();
                array.forEach(callback, thisArg);
            };

            BindableList.prototype.reactOnChange = function (items, reason) {
                _super.prototype.notifyListeners.call(this, items, reason);
                this.notifyCountListeners();
            };

            BindableList.prototype.notifyCountListeners = function () {
                if (this._count) {
                    if (this.getValue()) {
                        this._count.setValue(this.getValue().length);
                    } else {
                        this._count.setValue(0);
                    }
                }
            };
            return BindableList;
        })(JohnSmith.Binding.BindableValue);
        Binding.BindableList = BindableList;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var StaticBindableValue = (function () {
            function StaticBindableValue(value) {
                this._value = value;
            }
            StaticBindableValue.prototype.getValue = function () {
                return this._value;
            };

            StaticBindableValue.prototype.addListener = function (listener) {
            };

            StaticBindableValue.prototype.removeListener = function (listener) {
            };
            return StaticBindableValue;
        })();
        Binding.StaticBindableValue = StaticBindableValue;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var DefaultBindingManager = (function (_super) {
            __extends(DefaultBindingManager, _super);
            function DefaultBindingManager(handlerFactories, handlerArgumentProcessors) {
                _super.call(this, handlerArgumentProcessors);

                this._handlerFactories = handlerFactories;
            }
            DefaultBindingManager.prototype.bind = function (data) {
                var bindable = this.getBindable(data.bindableData);
                var handler = this.getHandler(data.handlerData, bindable, data.context, data.commandHost);
                var result = new JohnSmith.Binding.BindingWire(bindable, handler);

                return result;
            };

            DefaultBindingManager.prototype.getBindable = function (bindableObject) {
                if (bindableObject && bindableObject.getValue && bindableObject.addListener) {
                    return bindableObject;
                }

                return new JohnSmith.Binding.StaticBindableValue(bindableObject);
            };

            DefaultBindingManager.prototype.getHandler = function (handlerData, bindable, context, commandHost) {
                var options = this.processArguments(handlerData, context);
                for (var i = 0; i < this._handlerFactories.length; i++) {
                    var factory = this._handlerFactories[i];
                    var result = factory.createHandler(options, bindable, context, commandHost);
                    if (result) {
                        return result;
                    }
                }

                throw new Error("Could not transform object " + handlerData + " to bindable handler");
            };
            return DefaultBindingManager;
        })(JohnSmith.Common.ArgumentProcessorsBasedHandler);
        Binding.DefaultBindingManager = DefaultBindingManager;

        var ManualHandlerFactory = (function () {
            function ManualHandlerFactory() {
            }
            ManualHandlerFactory.prototype.createHandler = function (options, bindable, context, commandHost) {
                if (options && options.wireWith && options.unwireWith) {
                    return options;
                }

                return null;
            };
            return ManualHandlerFactory;
        })();
        Binding.ManualHandlerFactory = ManualHandlerFactory;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var CALLBACK_HANDLER_KEY = "callback";

        var CallbackHandler = (function () {
            function CallbackHandler(callback) {
                this._callback = callback;
            }
            CallbackHandler.prototype.wireWith = function (bindable) {
                bindable.addListener(this);
                this.invokeCallback(null, bindable.getValue(), 0 /* replace */);
            };

            CallbackHandler.prototype.unwireWith = function (bindable) {
                bindable.removeListener(this);
            };

            CallbackHandler.prototype.valueChanged = function (oldValue, newValue, changeType) {
                this.invokeCallback(oldValue, newValue, changeType);
            };

            CallbackHandler.prototype.invokeCallback = function (oldValue, newValue, changeType) {
                var context = window;

                this._callback.call(context, newValue, oldValue, changeType);
            };

            CallbackHandler.prototype.dispose = function () {
            };
            return CallbackHandler;
        })();
        Binding.CallbackHandler = CallbackHandler;

        var CallbackArgumentProcessor = (function () {
            function CallbackArgumentProcessor() {
            }
            CallbackArgumentProcessor.prototype.canProcess = function (argument, argumentIndex, options, context) {
                return argumentIndex == 0 && (options.handler == null || options.handler == CALLBACK_HANDLER_KEY) && (options.callback == null) && JohnSmith.Common.TypeUtils.isFunction(argument);
            };

            CallbackArgumentProcessor.prototype.process = function (argument, options, context) {
                options.handler = "callback";
                options.callback = argument;
            };
            return CallbackArgumentProcessor;
        })();
        Binding.CallbackArgumentProcessor = CallbackArgumentProcessor;

        var CallbackHandlerFactory = (function () {
            function CallbackHandlerFactory() {
            }
            CallbackHandlerFactory.prototype.createHandler = function (options, bindable, context, commandHost) {
                if (options && options.handler === "callback") {
                    return new JohnSmith.Binding.CallbackHandler(options.callback);
                }

                return null;
            };
            return CallbackHandlerFactory;
        })();
        Binding.CallbackHandlerFactory = CallbackHandlerFactory;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var DependentValue = (function (_super) {
            __extends(DependentValue, _super);
            function DependentValue(evaluate, dependencies) {
                _super.call(this);

                this._dependencies = dependencies;
                this._evaluateValue = evaluate;
                this._dependencyValues = [];
                this._allDependencies = [];

                for (var i = 0; i < dependencies.length; i++) {
                    var dependency = dependencies[i];
                    this.setupDependencyListener(dependency);
                    this._dependencyValues[i] = dependency.getValue();
                }
            }
            DependentValue.prototype.setupDependencyListener = function (dependency) {
                for (var i = 0; i < this._allDependencies.length; i++) {
                    if (this._allDependencies[i] === dependency) {
                        return;
                    }
                }

                this._allDependencies.push(dependency);

                var dependentValue = this;
                dependency.addListener({
                    valueChanged: function (oldValue, newValue, changeType) {
                        var actualValue = newValue;
                        if (changeType !== 0 /* replace */) {
                            actualValue = dependency.getValue();
                        }

                        dependentValue.notifyDependentListeners(dependency, actualValue);
                    }
                });
            };

            DependentValue.prototype.getValue = function () {
                return this._evaluateValue.apply(this, this._dependencyValues);
            };

            DependentValue.prototype.setValue = function (value) {
                throw Error("Could not set dependent value");
            };

            DependentValue.prototype.notifyDependentListeners = function (causedByDependency, newDependencyValue) {
                var oldValue = this.getValue();
                for (var i = 0; i < this._dependencies.length; i++) {
                    var dependency = this._dependencies[i];
                    if (dependency === causedByDependency) {
                        this._dependencyValues[i] = newDependencyValue;
                    }
                }

                var newValue = this.getValue();
                for (var i = 0; i < this.getListenersCount(); i++) {
                    var listener = this.getListener(i);
                    listener.valueChanged(oldValue, newValue, 0 /* replace */);
                }
            };
            return DependentValue;
        })(JohnSmith.Binding.BindableValue);
        Binding.DependentValue = DependentValue;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Fetchers) {
        var FetcherType = (function () {
            function FetcherType() {
            }
            FetcherType.Value = "value";
            FetcherType.CheckedAttribute = "checkedAttribute";
            return FetcherType;
        })();
        Fetchers.FetcherType = FetcherType;

        var ValueFetcher = (function () {
            function ValueFetcher() {
            }
            ValueFetcher.prototype.isSuitableFor = function (element) {
                var nodeName = element.getNodeName();
                if (nodeName) {
                    nodeName = nodeName.toUpperCase();

                    if (nodeName === "TEXTAREA" || nodeName === "SELECT") {
                        return true;
                    }

                    if (nodeName === "INPUT") {
                        var inputType = element.getAttribute("type");
                        if ((!inputType) || inputType.toUpperCase() === "TEXT") {
                            return true;
                        }
                    }
                }

                return false;
            };

            ValueFetcher.prototype.valueToElement = function (value, element) {
                element.setValue(value);
            };

            ValueFetcher.prototype.valueFromElement = function (element) {
                return element.getValue();
            };
            return ValueFetcher;
        })();

        var CheckedAttributeFetcher = (function () {
            function CheckedAttributeFetcher() {
            }
            CheckedAttributeFetcher.prototype.isSuitableFor = function (element) {
                var nodeName = element.getNodeName();
                if (nodeName) {
                    nodeName = nodeName.toUpperCase();
                    var type = element.getAttribute("type");
                    return nodeName === "INPUT" && type && type.toUpperCase() === "CHECKBOX";
                }

                return false;
            };

            CheckedAttributeFetcher.prototype.valueToElement = function (value, element) {
                element.setProperty("checked", value);
            };

            CheckedAttributeFetcher.prototype.valueFromElement = function (element) {
                var isChecked = false;
                if (element.getProperty("checked")) {
                    isChecked = true;
                }

                return isChecked;
            };
            return CheckedAttributeFetcher;
        })();

        var FetcherFactory = (function () {
            function FetcherFactory() {
                this._items = {};
            }
            FetcherFactory.prototype.getForElement = function (element) {
                for (var key in this._items) {
                    var fetcher = this._items[key];
                    if (fetcher.isSuitableFor(element)) {
                        return fetcher;
                    }
                }

                return null;
            };

            FetcherFactory.prototype.getByKey = function (key) {
                return this._items[key];
            };

            FetcherFactory.prototype.registerFetcher = function (key, fetcher) {
                this._items[key] = fetcher;
                return this;
            };
            return FetcherFactory;
        })();

        Fetchers.factory = new FetcherFactory().registerFetcher(FetcherType.Value, new ValueFetcher()).registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());
    })(JohnSmith.Fetchers || (JohnSmith.Fetchers = {}));
    var Fetchers = JohnSmith.Fetchers;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Events) {
        var Event = (function () {
            function Event() {
                this._listeners = [];
            }
            Event.prototype.listen = function (listener) {
                var that = this;
                this._listeners.push(listener);
                return {
                    dispose: function () {
                        that.removeListener(listener);
                    }
                };
            };

            Event.prototype.trigger = function (arg) {
                for (var i = 0; i < this._listeners.length; i++) {
                    this._listeners[i](arg);
                }
            };

            Event.prototype.dispose = function () {
                this._listeners = null;
            };

            Event.prototype.getListenersCount = function () {
                if (this._listeners === null) {
                    return 0;
                }

                return this._listeners.length;
            };

            Event.prototype.hasListeners = function () {
                return this.getListenersCount() > 0;
            };

            Event.prototype.removeListener = function (listener) {
                JohnSmith.Common.ArrayUtils.removeItem(this._listeners, listener);
            };
            return Event;
        })();
        Events.Event = Event;
    })(JohnSmith.Events || (JohnSmith.Events = {}));
    var Events = JohnSmith.Events;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (View) {
        var DefaultView = (function () {
            function DefaultView(bindableManager, commandManager, elementFactory, viewData, viewModel, eventBus, viewFactory, markupResolver) {
                this._bindableManager = bindableManager;
                this._commandManager = commandManager;
                this._elementFactory = elementFactory;
                this._data = viewData;
                this._viewModel = viewModel;
                this._eventBus = eventBus;
                this._viewFactory = viewFactory;
                this._markupResolver = markupResolver;

                this._bindings = [];
                this._commands = [];
                this._unrender = new JohnSmith.Events.Event();
            }
            DefaultView.prototype.find = function (query) {
                return this.getRootElement().findRelative(query);
            };

            DefaultView.prototype.addChild = function (destination, child, viewModel) {
                if (!this.hasChildren()) {
                    this._children = [];
                }

                this._children.push({
                    child: child,
                    destination: destination,
                    viewModel: viewModel
                });
            };

            DefaultView.prototype.attachTo = function (destination) {
                var destinationElement = typeof destination == "string" ? this._elementFactory.createElement(destination) : destination;

                this.attachViewToRoot(destinationElement);
            };

            DefaultView.prototype.renderTo = function (destination) {
                var templateHtml = this._markupResolver.resolve(this._data.template);

                var destinationElement = typeof destination == "string" ? this._elementFactory.createElement(destination) : destination;

                var root = destinationElement.appendHtml(templateHtml);

                this.attachViewToRoot(root);
            };

            DefaultView.prototype.onUnrender = function () {
                return this._unrender;
            };

            DefaultView.prototype.attachViewToRoot = function (root) {
                this._rootElement = root;

                this._eventBus.trigger("viewRendered", {
                    root: this._rootElement,
                    view: this
                });

                if (this._data.init) {
                    this._data.init(this, this._viewModel);
                }

                for (var i = 0; i < this._bindings.length; i++) {
                    this._bindings[i].init();
                }

                if (this.hasChildren()) {
                    for (var i = 0; i < this._children.length; i++) {
                        var childData = this._children[i];
                        var viewModel = childData.viewModel;
                        var child = this._viewFactory.resolve(childData.child, viewModel);
                        child.renderTo(this._rootElement.findRelative(childData.destination));
                    }
                }

                if (this._viewModel && this._viewModel.initState) {
                    this._viewModel.initState();
                }
            };

            DefaultView.prototype.bind = function (bindable) {
                var binding = new JohnSmith.Binding.BindingConfig(this._bindableManager, bindable, this._rootElement, this, false);

                this._bindings.push(binding);

                return binding;
            };

            DefaultView.prototype.on = function () {
                var causeArguments = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    causeArguments[_i] = arguments[_i + 0];
                }
                var commandConfig = new JohnSmith.Command.CommandConfig(causeArguments, this._commandManager, this.getRootElement(), this._viewModel);

                this._commands.push(commandConfig);

                return commandConfig;
            };

            DefaultView.prototype.getRootElement = function () {
                return this._rootElement;
            };

            DefaultView.prototype.unrenderView = function () {
                if (this._unrender.hasListeners()) {
                    this._unrender.trigger(this);
                } else {
                    this.getRootElement().remove();
                }
            };

            DefaultView.prototype.dispose = function () {
                this.unrenderView();

                if (this._viewModel && this._viewModel.releaseState) {
                    this._viewModel.releaseState();
                }

                if (this.hasChildren()) {
                    for (var i = 0; i < this._children.length; i++) {
                        this._children[i].child.dispose();
                    }
                }

                for (var i = 0; i < this._bindings.length; i++) {
                    this._bindings[i].dispose();
                }

                for (var i = 0; i < this._commands.length; i++) {
                    this._commands[i].dispose();
                }
            };

            DefaultView.prototype.hasChildren = function () {
                return this._children != null;
            };
            return DefaultView;
        })();
        View.DefaultView = DefaultView;
    })(JohnSmith.View || (JohnSmith.View = {}));
    var View = JohnSmith.View;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (View) {
        var DefaultViewFactory = (function () {
            function DefaultViewFactory(bindableManager, commandManager, elementFactory, eventBus, markupResolver) {
                this._bindableManager = bindableManager;
                this._commandManager = commandManager;
                this._elementFactory = elementFactory;
                this._eventBus = eventBus;
                this._markupResolver = markupResolver;
            }
            DefaultViewFactory.prototype.resolve = function (dataDescriptor, viewModel) {
                if (!dataDescriptor) {
                    throw new Error("Expected view data object was not defined");
                }

                if (JohnSmith.Common.TypeUtils.isFunction(dataDescriptor)) {
                    var newInstance = new dataDescriptor();
                    return this.resolve(newInstance, viewModel);
                }

                if (dataDescriptor.template) {
                    return new JohnSmith.View.DefaultView(this._bindableManager, this._commandManager, this._elementFactory, dataDescriptor, viewModel, this._eventBus, this, this._markupResolver);
                }

                if (dataDescriptor.renderTo && dataDescriptor.getRootElement) {
                    return dataDescriptor;
                }

                throw new Error("Could not resolve view data by provided descriptor");
            };
            return DefaultViewFactory;
        })();
        View.DefaultViewFactory = DefaultViewFactory;
    })(JohnSmith.View || (JohnSmith.View = {}));
    var View = JohnSmith.View;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (View) {
        var ViewArgumentProcessor = (function () {
            function ViewArgumentProcessor(viewFactory) {
                this._viewFactory = viewFactory;
            }
            ViewArgumentProcessor.prototype.canProcess = function (argument, argumentIndex, options, context) {
                return argumentIndex === 1 && (!options.view);
            };

            ViewArgumentProcessor.prototype.process = function (argument, options, context) {
                try  {
                    var viewFactory = this._viewFactory;
                    viewFactory.resolve(argument, null);
                    options.view = argument;
                } catch (Error) {
                }
            };
            return ViewArgumentProcessor;
        })();
        View.ViewArgumentProcessor = ViewArgumentProcessor;

        var ViewValueRenderer = (function () {
            function ViewValueRenderer(viewFactory, viewDescriptor) {
                this._viewFactory = viewFactory;
                this._viewDescriptor = viewDescriptor;
            }
            ViewValueRenderer.prototype.render = function (value, destination) {
                var currentView = this._viewFactory.resolve(this._viewDescriptor, value);
                currentView.renderTo(destination);

                return {
                    element: currentView.getRootElement(),
                    dispose: function () {
                        currentView.dispose();
                    },
                    unrender: function () {
                        currentView.unrenderView();
                    }
                };
            };
            return ViewValueRenderer;
        })();
        View.ViewValueRenderer = ViewValueRenderer;

        
    })(JohnSmith.View || (JohnSmith.View = {}));
    var View = JohnSmith.View;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var RendererBase = (function () {
            function RendererBase(formatter) {
                this._formatter = formatter;
            }
            RendererBase.prototype.render = function (value, destination) {
                var formattedValue = this._formatter.format(value);
                return {
                    element: this.doRender(formattedValue, destination),
                    dispose: function () {
                        this.element.remove();
                    }
                };
            };

            RendererBase.prototype.doRender = function (formattedValue, destination) {
                return null;
            };
            return RendererBase;
        })();
        Binding.RendererBase = RendererBase;

        var TextRenderer = (function (_super) {
            __extends(TextRenderer, _super);
            function TextRenderer(formatter) {
                _super.call(this, formatter);
            }
            TextRenderer.prototype.doRender = function (formattedValue, destination) {
                return destination.appendText(formattedValue);
            };
            return TextRenderer;
        })(RendererBase);
        Binding.TextRenderer = TextRenderer;

        var HtmlRenderer = (function (_super) {
            __extends(HtmlRenderer, _super);
            function HtmlRenderer(formatter) {
                _super.call(this, formatter);
            }
            HtmlRenderer.prototype.doRender = function (formattedValue, destination) {
                return destination.appendHtml(formattedValue);
            };
            return HtmlRenderer;
        })(RendererBase);
        Binding.HtmlRenderer = HtmlRenderer;

        var ResolvableMarkupRenderer = (function (_super) {
            __extends(ResolvableMarkupRenderer, _super);
            function ResolvableMarkupRenderer(formatter, markupResolver) {
                _super.call(this, formatter);
                this._markupResolver = markupResolver;
            }
            ResolvableMarkupRenderer.prototype.doRender = function (formattedValue, destination) {
                var markup = this._markupResolver.resolve(formattedValue);
                return destination.appendHtml(markup);
            };
            return ResolvableMarkupRenderer;
        })(RendererBase);
        Binding.ResolvableMarkupRenderer = ResolvableMarkupRenderer;

        var FetcherToRendererAdapter = (function () {
            function FetcherToRendererAdapter(fetcher) {
                this._fetcher = fetcher;
            }
            FetcherToRendererAdapter.prototype.render = function (formattedValue, destination) {
                this._fetcher.valueToElement(formattedValue, destination);
                return {
                    element: destination,
                    dispose: function () {
                    }
                };
            };
            return FetcherToRendererAdapter;
        })();
        Binding.FetcherToRendererAdapter = FetcherToRendererAdapter;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var RenderValueHandler = (function () {
            function RenderValueHandler(contentDestination, renderer) {
                this._contentDestination = contentDestination;
                this._valueRenderer = renderer;
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

            RenderValueHandler.prototype.dispose = function () {
                this.disposeCurrentValue();
            };

            RenderValueHandler.prototype.doRender = function (value) {
                this.disposeCurrentValue();

                if (value !== null && value !== undefined) {
                    this._currentValue = this._valueRenderer.render(value, this._contentDestination);
                }
            };

            RenderValueHandler.prototype.disposeCurrentValue = function () {
                if (this._currentValue) {
                    this._currentValue.dispose();
                }
            };
            return RenderValueHandler;
        })();
        Binding.RenderValueHandler = RenderValueHandler;

        var RenderHandlerFactoryBase = (function () {
            function RenderHandlerFactoryBase(destinationFactory, markupResolver, viewFactory, fetcherFactory) {
                this._destinationFactory = destinationFactory;
                this._markupResolver = markupResolver;
                this._viewFactory = viewFactory;
                this._fetcherFactory = fetcherFactory;
            }
            RenderHandlerFactoryBase.prototype.fillContentDestination = function (options, context) {
                if (!options.contentDestination) {
                    options.contentDestination = context == null ? this._destinationFactory.createElement(options.to) : context.findRelative(options.to);
                }
            };

            RenderHandlerFactoryBase.prototype.fillRenderer = function (options, commandHost, bindable) {
                if (!options.renderer) {
                    if (options.view) {
                        options.renderer = new JohnSmith.View.ViewValueRenderer(this._viewFactory, options.view);
                    } else {
                        if (!options.valueType) {
                            var encode = true;
                            if (options.encode !== undefined) {
                                encode = options.encode;
                            }

                            options.valueType = encode ? JohnSmith.Common.ValueType.text : JohnSmith.Common.ValueType.html;
                        }

                        if (!options.formatter) {
                            options.formatter = new DefaultFormatter();
                        }

                        options.renderer = this.getRenderer(options, commandHost, bindable);
                    }
                }
            };

            RenderHandlerFactoryBase.prototype.getRenderer = function (options, commandHost, bindable) {
                var fetcher = null;

                if (options.fetch) {
                    fetcher = this._fetcherFactory.getByKey(options.fetch);
                    if (!fetcher) {
                        throw new Error("Fetcher " + options.fetch + " not found");
                    }
                } else {
                    fetcher = this._fetcherFactory.getForElement(options.contentDestination);
                }

                if (fetcher) {
                    if (options.bidirectional !== false) {
                        var command = options.command;
                        var context = options.commandContext;
                        var event = options.event || "change";

                        var bindableObject = bindable;
                        if ((!command) && bindableObject.setValue) {
                            command = bindableObject.setValue;
                            context = bindableObject;
                        }

                        if (command) {
                            commandHost.on(options.to, event).react(command, context);
                        }
                    }

                    return new JohnSmith.Binding.FetcherToRendererAdapter(fetcher);
                }

                switch (options.valueType) {
                    case JohnSmith.Common.ValueType.text:
                        return new JohnSmith.Binding.TextRenderer(options.formatter);
                    case JohnSmith.Common.ValueType.html:
                        return new JohnSmith.Binding.HtmlRenderer(options.formatter);
                    case JohnSmith.Common.ValueType.unknown:
                        return new JohnSmith.Binding.ResolvableMarkupRenderer(options.formatter, this._markupResolver);
                    default:
                        throw new Error("Unknown value type: " + options.valueType);
                }
            };

            RenderHandlerFactoryBase.prototype.isList = function (bindable) {
                if (bindable instanceof JohnSmith.Binding.BindableList) {
                    return true;
                } else if (bindable) {
                    var value = bindable.getValue();
                    if (value instanceof Array) {
                        return true;
                    }
                }

                return false;
            };
            return RenderHandlerFactoryBase;
        })();
        Binding.RenderHandlerFactoryBase = RenderHandlerFactoryBase;

        var RenderValueFactory = (function (_super) {
            __extends(RenderValueFactory, _super);
            function RenderValueFactory(destinationFactory, markupResolver, viewFactory, fetcherFactory) {
                _super.call(this, destinationFactory, markupResolver, viewFactory, fetcherFactory);
            }
            RenderValueFactory.prototype.createHandler = function (handlerData, bindable, context, commandHost) {
                if (!handlerData) {
                    return null;
                }

                var options = handlerData;
                if (options.handler && options.handler !== "render") {
                    return null;
                }

                if (options.type && options.type !== "value") {
                    return null;
                }

                if (!options.type) {
                    if (this.isList(bindable)) {
                        return null;
                    }
                }

                this.fillContentDestination(options, context);
                this.fillRenderer(options, commandHost, bindable);

                var handler = new RenderValueHandler(options.contentDestination, options.renderer);

                return handler;
            };
            return RenderValueFactory;
        })(RenderHandlerFactoryBase);
        Binding.RenderValueFactory = RenderValueFactory;

        var DefaultFormatter = (function () {
            function DefaultFormatter() {
            }
            DefaultFormatter.prototype.format = function (value) {
                return value.toString();
            };
            return DefaultFormatter;
        })();
        Binding.DefaultFormatter = DefaultFormatter;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var RenderListHandler = (function () {
            function RenderListHandler(contentDestination, renderer) {
                this._contentDestination = contentDestination;
                this._valueRenderer = renderer;
                this._renderedValues = [];
            }
            RenderListHandler.prototype.wireWith = function (bindable) {
                this.doRender(bindable.getValue(), 0 /* replace */);
                bindable.addListener(this);
            };

            RenderListHandler.prototype.unwireWith = function (bindable) {
                bindable.removeListener(this);
            };

            RenderListHandler.prototype.valueChanged = function (oldValue, newValue, changeType) {
                this.doRender(newValue, changeType);
            };

            RenderListHandler.prototype.dispose = function () {
                for (var i = 0; i < this._renderedValues.length; i++) {
                    if (this._renderedValues[i].renderedValue.dispose) {
                        this._renderedValues[i].renderedValue.dispose();
                    }
                }
            };

            RenderListHandler.prototype.findRenderedValue = function (value) {
                for (var i = 0; i < this._renderedValues.length; i++) {
                    if (this._renderedValues[i].value === value) {
                        return this._renderedValues[i].renderedValue;
                    }
                }

                return null;
            };

            RenderListHandler.prototype.removeRenderedValue = function (renderedValue) {
                var indexToRemove = -1;
                for (var i = 0; i < this._renderedValues.length; i++) {
                    if (this._renderedValues[i].renderedValue === renderedValue) {
                        indexToRemove = i;
                    }
                }

                if (indexToRemove >= 0) {
                    this._renderedValues.splice(indexToRemove, 1);
                }
            };

            RenderListHandler.prototype.doRender = function (value, reason) {
                var items = value;

                if (reason == 2 /* remove */) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var itemRenderedValue = this.findRenderedValue(item);
                        if (itemRenderedValue) {
                            itemRenderedValue.dispose();
                            this.removeRenderedValue(itemRenderedValue);
                        }
                    }
                } else if (reason == 1 /* add */) {
                    this.appendItems(value);
                } else {
                    this._renderedValues = [];
                    this._contentDestination.empty();
                    this.appendItems(value);
                }
            };

            RenderListHandler.prototype.appendItems = function (items) {
                if (!items) {
                    return;
                }

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemRenderedValue = this._valueRenderer.render(item, this._contentDestination);
                    this._renderedValues.push({
                        value: item,
                        renderedValue: itemRenderedValue
                    });
                }
            };
            return RenderListHandler;
        })();
        Binding.RenderListHandler = RenderListHandler;

        var RenderListFactory = (function (_super) {
            __extends(RenderListFactory, _super);
            function RenderListFactory(destinationFactory, markupResolver, viewFactory, fetcherFactory) {
                _super.call(this, destinationFactory, markupResolver, viewFactory, fetcherFactory);
            }
            RenderListFactory.prototype.createHandler = function (handlerData, bindable, context, commandHost) {
                if (!handlerData) {
                    return null;
                }

                var options = handlerData;
                if (options.handler && options.handler !== "render") {
                    return null;
                }

                if (options.type && options.type !== "list") {
                    return null;
                }

                if (!options.type) {
                    if (!this.isList(bindable)) {
                        return null;
                    }
                }

                this.fillContentDestination(options, context);
                this.fillRenderer(options, commandHost, bindable);

                var handler = new RenderListHandler(options.contentDestination, options.renderer);

                return handler;
            };
            return RenderListFactory;
        })(JohnSmith.Binding.RenderHandlerFactoryBase);
        Binding.RenderListFactory = RenderListFactory;
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Command) {
        var EventCommandCause = (function () {
            function EventCommandCause(targetElement, event, commandContext, argumentsFetcher) {
                this._targetElement = targetElement;
                this._event = event;
                this._commandContext = commandContext;
                this._argumentsFetcher = argumentsFetcher;
            }
            EventCommandCause.prototype.wireWith = function (command) {
                var context = this._commandContext;
                var argumentsFetcher = this._argumentsFetcher;

                this._handlerRef = this._targetElement.attachEventHandler(this._event, function (target) {
                    var commandArguments = argumentsFetcher == null ? [] : argumentsFetcher.fetch(target);

                    command.execute.apply(context, commandArguments);
                });
            };

            EventCommandCause.prototype.dispose = function () {
                this._targetElement.detachEventHandler(this._event, this._handlerRef);
            };
            return EventCommandCause;
        })();
        Command.EventCommandCause = EventCommandCause;

        var FetcherToArgumentFetcherAdapter = (function () {
            function FetcherToArgumentFetcherAdapter(fetcher) {
                this._fetcher = fetcher;
            }
            FetcherToArgumentFetcherAdapter.prototype.fetch = function (target) {
                return [this._fetcher.valueFromElement(target)];
            };
            return FetcherToArgumentFetcherAdapter;
        })();

        var DefaultCommandManager = (function (_super) {
            __extends(DefaultCommandManager, _super);
            function DefaultCommandManager(argumentProcessors, elementFactory, fetcherFactory) {
                _super.call(this, argumentProcessors);
                this._elementFactory = elementFactory;
                this._fetcherFactory = fetcherFactory;
            }
            DefaultCommandManager.prototype.setUpBinding = function (data) {
                var command = this.getCommand(data.command);
                if (!data.commandContext) {
                    data.commandContext = command;
                }

                var cause = this.getCause(data.causeData, data.context, data.commandContext);
                return new JohnSmith.Command.CommandWire(command, cause);
            };

            DefaultCommandManager.prototype.getCommand = function (command) {
                if (JohnSmith.Common.TypeUtils.isFunction(command)) {
                    var result = {
                        execute: command
                    };

                    return result;
                }

                if (command.execute) {
                    return command;
                }

                throw new Error("Could not transform " + command + " to command object");
            };

            DefaultCommandManager.prototype.getCause = function (causeData, context, commandContext) {
                var options = this.processArguments(causeData, context);
                return this.getCauseByOptions(options, context, commandContext);
            };

            DefaultCommandManager.prototype.getCauseByOptions = function (commandCauseOptions, context, commandContext) {
                var options = commandCauseOptions;
                if (!options.to) {
                    throw new Error("Required option 'to' is not set!");
                }

                if (!options.event) {
                    throw new Error("Required option 'event' is not set!");
                }

                var target = context == null ? this._elementFactory.createElement(options.to) : context.findRelative(options.to);

                if (!options.argumentsFetcher) {
                    var fetcher = null;
                    if (options.fetch) {
                        fetcher = this._fetcherFactory.getByKey(options.fetch);
                    } else {
                        fetcher = this._fetcherFactory.getForElement(target);
                    }

                    if (fetcher) {
                        options.argumentsFetcher = new FetcherToArgumentFetcherAdapter(fetcher);
                    }
                }

                return new EventCommandCause(target, options.event, commandContext, options.argumentsFetcher);
            };
            return DefaultCommandManager;
        })(JohnSmith.Common.ArgumentProcessorsBasedHandler);
        Command.DefaultCommandManager = DefaultCommandManager;
    })(JohnSmith.Command || (JohnSmith.Command = {}));
    var Command = JohnSmith.Command;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Command) {
        var EventArgumentProcessor = (function () {
            function EventArgumentProcessor() {
            }
            EventArgumentProcessor.prototype.canProcess = function (argument, argumentIndex, options, context) {
                return (typeof argument == "string") && argumentIndex == 1;
            };

            EventArgumentProcessor.prototype.process = function (argument, options, context) {
                options.event = argument;
            };
            return EventArgumentProcessor;
        })();
        Command.EventArgumentProcessor = EventArgumentProcessor;
    })(JohnSmith.Command || (JohnSmith.Command = {}));
    var Command = JohnSmith.Command;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (JQuery) {
        var JQueryElement = (function () {
            function JQueryElement(target) {
                this._target = target;
            }
            JQueryElement.prototype.isEmpty = function () {
                return this._target.length == 0;
            };

            JQueryElement.prototype.empty = function () {
                this._target.empty();
            };

            JQueryElement.prototype.appendHtml = function (html) {
                if (!html) {
                    throw new Error("Could not append empty string!");
                }

                if (typeof html !== "string") {
                    throw new Error("Expected string markup but was" + html);
                }

                var parsedHtml = $($.parseHTML(html));

                this._target.append(parsedHtml);
                return new JQueryElement(parsedHtml);
            };

            JQueryElement.prototype.appendText = function (text) {
                if (text === undefined || text == null) {
                    throw new Error("Could not append null object!");
                }

                if (typeof text !== "string") {
                    throw new Error("Expected string text but was" + text);
                }

                if (text === "") {
                    this.getTarget().empty();
                    return this;
                }

                var encodedHtml = $("<div/>").text(text).html();

                return this.appendHtml(encodedHtml);
            };

            JQueryElement.prototype.getHtml = function () {
                return this._target.html();
            };

            JQueryElement.prototype.getNodeName = function () {
                if (this._target.length == 1) {
                    return this._target[0].nodeName;
                }

                return null;
            };

            JQueryElement.prototype.findRelative = function (query) {
                var result = this._target.filter(query);
                if (result.length == 0) {
                    result = this._target.find(query);
                }

                return new JQueryElement(result);
            };

            JQueryElement.prototype.remove = function () {
                this._target.remove();
            };

            JQueryElement.prototype.getTarget = function () {
                return this._target;
            };

            JQueryElement.prototype.setText = function (text) {
                this._target.text(text);
            };

            JQueryElement.prototype.setHtml = function (html) {
                this._target.html(html);
            };

            JQueryElement.prototype.addClass = function (className) {
                this._target.addClass(className);
            };

            JQueryElement.prototype.removeClass = function (className) {
                this._target.removeClass(className);
            };

            JQueryElement.prototype.attachClickHandler = function (callback) {
                this._target.click(callback);
            };

            JQueryElement.prototype.attachEventHandler = function (event, callback) {
                var actualCallback = function () {
                    callback(new JQueryElement($(this)));
                    return false;
                };

                this._target.on(event, actualCallback);
                return actualCallback;
            };

            JQueryElement.prototype.detachEventHandler = function (event, handler) {
                this._target.off(event, handler);
            };

            JQueryElement.prototype.getValue = function () {
                return this._target.val();
            };

            JQueryElement.prototype.setValue = function (value) {
                return this._target.val(value);
            };

            JQueryElement.prototype.getAttribute = function (attribute) {
                return this._target.attr(attribute);
            };

            JQueryElement.prototype.setAttribute = function (attribute, value) {
                this._target.attr(attribute, value);
            };

            JQueryElement.prototype.getProperty = function (property) {
                return this._target.prop(property);
            };

            JQueryElement.prototype.setProperty = function (property, value) {
                this._target.prop(property, value);
            };
            return JQueryElement;
        })();
        JQuery.JQueryElement = JQueryElement;

        var JQueryMarkupResolver = (function () {
            function JQueryMarkupResolver() {
            }
            JQueryMarkupResolver.prototype.resolve = function (markup) {
                var $markup;
                if (markup instanceof jQuery) {
                    $markup = markup;
                } else {
                    try  {
                        $markup = $(markup);
                    } catch (error) {
                        return markup;
                    }
                }

                if ($markup.parent().length > 0) {
                    return $markup.html();
                }

                if (typeof markup === "string") {
                    return markup;
                }

                if (markup instanceof jQuery) {
                    return $("<p>").append(markup).html();
                }

                throw new Error("Could not resolve markup by object " + markup);
            };
            return JQueryMarkupResolver;
        })();
        JQuery.JQueryMarkupResolver = JQueryMarkupResolver;

        var JQueryTargetArgumentProcessor = (function () {
            function JQueryTargetArgumentProcessor() {
            }
            JQueryTargetArgumentProcessor.prototype.canProcess = function (argument, argumentIndex, options, context) {
                return (typeof argument == "string") && argumentIndex == 0;
            };

            JQueryTargetArgumentProcessor.prototype.process = function (argument, options, context) {
                if (!options.to) {
                    options.to = argument;
                }
            };
            return JQueryTargetArgumentProcessor;
        })();
        JQuery.JQueryTargetArgumentProcessor = JQueryTargetArgumentProcessor;
    })(JohnSmith.JQuery || (JohnSmith.JQuery = {}));
    var JQuery = JohnSmith.JQuery;
})(JohnSmith || (JohnSmith = {}));
var JohnSmith;
(function (JohnSmith) {
    (function (Api) {
        var PublicApi = (function () {
            function PublicApi(bindableManager, commandManager, viewFactory, eventBus) {
                this._bindableManager = bindableManager;
                this._commandManager = commandManager;
                this._viewFactory = viewFactory;

                this.event = {
                    bus: eventBus
                };
            }
            PublicApi.prototype.bindableValue = function () {
                return new JohnSmith.Binding.BindableValue();
            };

            PublicApi.prototype.bindableList = function () {
                return new JohnSmith.Binding.BindableList();
            };

            PublicApi.prototype.dependentValue = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var dependencies = [];
                for (var i = 0; i < args.length - 1; i++) {
                    dependencies.push(args[i]);
                }

                return new JohnSmith.Binding.DependentValue(args[args.length - 1], dependencies);
            };

            PublicApi.prototype.bind = function (bindable) {
                return new JohnSmith.Binding.BindingConfig(this._bindableManager, bindable, null, this, true);
            };

            PublicApi.prototype.on = function () {
                var causeData = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    causeData[_i] = arguments[_i + 0];
                }
                return new JohnSmith.Command.CommandConfig(causeData, this._commandManager, null);
            };

            PublicApi.prototype.createView = function (viewDescriptor, viewModel) {
                return this._viewFactory.resolve(viewDescriptor, viewModel);
            };

            PublicApi.prototype.renderView = function (viewDescriptor, viewModel) {
                var view = this._viewFactory.resolve(viewDescriptor, viewModel);
                return {
                    to: function (destination) {
                        view.renderTo(destination);
                    }
                };
            };

            PublicApi.prototype.attachView = function (viewDescriptor, viewModel) {
                var view = this._viewFactory.resolve(viewDescriptor, viewModel);
                return {
                    to: function (destination) {
                        view.attachTo(destination);
                    }
                };
            };
            return PublicApi;
        })();

        var Configurer = (function () {
            function Configurer() {
                this._handlerFactories = [];
                this._handlerArgumentProcessors = [];
                this._commandCauseArgumentProcessors = [];
            }
            Configurer.prototype.configure = function () {
                var eventBus = new JohnSmith.Common.DefaultEventBus();

                this.createDependencies(eventBus);

                return new PublicApi(this._bindableManager, this._commandManager, this._viewFactory, eventBus);
            };

            Configurer.prototype.createDependencies = function (eventBus) {
                this._elementFactory = {
                    createElement: function (query) {
                        return new JohnSmith.JQuery.JQueryElement($(query));
                    }
                };

                this._fetcherFactory = JohnSmith.Fetchers.factory;

                this._commandManager = new JohnSmith.Command.DefaultCommandManager(this._commandCauseArgumentProcessors, this._elementFactory, this._fetcherFactory);

                this._markupResolver = new JohnSmith.JQuery.JQueryMarkupResolver();

                this._commandCauseArgumentProcessors.push(new JohnSmith.Command.EventArgumentProcessor());
                this._commandCauseArgumentProcessors.push(new JohnSmith.JQuery.JQueryTargetArgumentProcessor());

                this._bindableManager = new JohnSmith.Binding.DefaultBindingManager(this._handlerFactories, this._handlerArgumentProcessors);

                this._viewFactory = new JohnSmith.View.DefaultViewFactory(this._bindableManager, this._commandManager, this._elementFactory, eventBus, this._markupResolver);

                this._handlerFactories.push(new JohnSmith.Binding.ManualHandlerFactory());
                this._handlerFactories.push(new JohnSmith.Binding.CallbackHandlerFactory());
                this._handlerFactories.push(new JohnSmith.Binding.RenderListFactory(this._elementFactory, this._markupResolver, this._viewFactory, this._fetcherFactory));
                this._handlerFactories.push(new JohnSmith.Binding.RenderValueFactory(this._elementFactory, this._markupResolver, this._viewFactory, this._fetcherFactory));

                this._handlerArgumentProcessors.push(new JohnSmith.Binding.CallbackArgumentProcessor());
                this._handlerArgumentProcessors.push(new JohnSmith.JQuery.JQueryTargetArgumentProcessor());
                this._handlerArgumentProcessors.push(new JohnSmith.View.ViewArgumentProcessor(this._viewFactory));
            };
            return Configurer;
        })();

        var jsVarName = window["JohnSmithAcronym"] || "js";
        window[jsVarName] = new Configurer().configure();
    })(JohnSmith.Api || (JohnSmith.Api = {}));
    var Api = JohnSmith.Api;
})(JohnSmith || (JohnSmith = {}));
