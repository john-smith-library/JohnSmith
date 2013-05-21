var __extends = this.__extends || function (d, b) {
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
                _super.prototype.notifyListeners.call(this, args, Binding.DataChangeReason.add);
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
                _super.prototype.notifyListeners.call(this, args, Binding.DataChangeReason.remove);
            };
            return BindableList;
        })(Binding.BindableValue);
        Binding.BindableList = BindableList;        
        JohnSmith.Common.JS.bindableList = function () {
            return new BindableList();
        };
    })(JohnSmith.Binding || (JohnSmith.Binding = {}));
    var Binding = JohnSmith.Binding;
})(JohnSmith || (JohnSmith = {}));
//@ sourceMappingURL=BindableList.js.map
