var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
        var BindableValue = (function () {
            function BindableValue() {
                this.listeners = new JohnSmith.Common.ArrayList();
            }
            BindableValue.prototype.getValue = function () {
                return this.value;
            };
            BindableValue.prototype.setValue = function (value) {
                this.notifyListeners(value, Binding.DataChangeReason.replace);
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
        JohnSmith.Common.JS.bindableValue = function () {
            return new BindableValue();
        };
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=BindableValue.js.map
