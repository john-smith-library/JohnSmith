/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="BindableValue.ts"/>

module JohnSmith.Binding {
    export class BindableList extends BindableValue implements IBindable {
        constructor(){
            super();
            super.setValue([]);
        }

        public setValue(value: any) {
            if (value){
                if (!(value instanceof Array)){
                    throw new Error("Bindable list supports only array values");
                }
            }

            super.setValue(value);
        }

        public add(...args:any[]): void {
            var array:Array = this.getValue();
            for (var i = 0; i < args.length; i++){
                array.push(args[i]);
            }

            super.notifyListeners(args, DataChangeReason.add);
        }

        public remove(...args:any[]):void {
            var array:Array = this.getValue();
            for (var i = 0; i < args.length; i++){
                var indexToRemove:number = -1;
                for (var j = 0; j < array.length; j++){
                    if (array[j] == args[i]){
                        indexToRemove = j;
                    }
                }

                if (indexToRemove >= 0){
                    array.splice(indexToRemove, 1);
                }
            }

            super.notifyListeners(args, DataChangeReason.remove);
        }
    }

    JohnSmith.Common.JS.bindableList = function():JohnSmith.Binding.BindableList {
        return new BindableList();
    }
}