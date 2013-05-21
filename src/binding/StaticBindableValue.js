var JohnSmith;
(function (JohnSmith) {
    (function (Binding) {
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
        var StaticBindableFactory = (function () {
            function StaticBindableFactory() { }
            StaticBindableFactory.prototype.createBindable = function (bindable) {
                return new StaticBindableValue(bindable);
            };
            return StaticBindableFactory;
        })();        
        JohnSmith.Common.JS.addBindableFactory(new StaticBindableFactory());
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=StaticBindableValue.js.map
