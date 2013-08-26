/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="BindableValue.ts"/>

module JohnSmith.Binding {
    export class BindableList extends BindableValue implements IBindable {
        private _count: BindableValue;

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
            this.notifyCountListeners();
        }

        public add(...args:any[]): void {
            var array:Array = this.getValue();
            for (var i = 0; i < args.length; i++){
                array.push(args[i]);
            }

            this.reactOnChange(args, DataChangeReason.add);
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

            this.reactOnChange(args, DataChangeReason.remove);
        }

        /** Removes all items from the list */
        public clear(): void {
            var removed = this.getValue().splice(0, this.getValue().length);
            this.reactOnChange(removed, DataChangeReason.remove);
        }

        /** Returns a bindable value that stores size of the list */
        public count():BindableValue {
            if (!this._count) {
                this._count = new BindableValue();
            }

            return this._count;
        }

        public forEach(callback, thisArg){
            var array:Array = this.getValue();
            array.forEach(callback, thisArg);
        }

        private reactOnChange(items: any[], reason:DataChangeReason):void{
            super.notifyListeners(items, reason);
            this.notifyCountListeners();
        }

        private notifyCountListeners():void {
            if (this._count){
                if (this.getValue()) {
                    this._count.setValue(this.getValue().length);
                } else {
                    this._count.setValue(0);
                }

            }
        }
    }

    JohnSmith.Common.JS.bindableList = function():JohnSmith.Binding.BindableList {
        return new BindableList();
    }
}