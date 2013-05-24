var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var CallbackHandler = (function () {
            function CallbackHandler(callback) {
                this.callback = callback;
            }
            CallbackHandler.prototype.wireWith = function (bindable) {
                bindable.addListener(this);
            };
            CallbackHandler.prototype.unwireWith = function (bindable) {
                bindable.removeListener(this);
            };
            CallbackHandler.prototype.valueChanged = function (oldValue, newValue, changeType) {
                this.callback(newValue, oldValue, changeType);
            };
            CallbackHandler.prototype.dispose = function () {
            };
            return CallbackHandler;
        })();
        Binding.CallbackHandler = CallbackHandler;        
        JohnSmith.Common.JS.addHandlerFactory({
            createHandler: function (data, context) {
                if(data && data.handler === "callback") {
                    return new CallbackHandler(data.callback);
                }
                return null;
            }
        });
        JohnSmith.Common.JS.addHandlerTransformer({
            description: "function => {handler: 'callback'}",
            checkApplicability: function (data, bindable, context) {
                if(data && data.length > 0) {
                    var firstArgument = data[0];
                    if(JohnSmith.Common.TypeUtils.isFunction(firstArgument)) {
                        return Binding.TransformerApplicability.Applicable;
                    }
                }
                return Binding.TransformerApplicability.NotApplicable;
            },
            transform: function (data, bindable, context) {
                data[0] = {
                    handler: "callback",
                    callback: data[0]
                };
                return data;
            }
        });
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=CallbackHandler.js.map
