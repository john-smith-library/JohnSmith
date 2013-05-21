var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
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
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=StateTransitionHandler.js.map
