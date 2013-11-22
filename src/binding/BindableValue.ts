/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    /**
     * Creates simple bindable value.
     */
    export class BindableValue implements IBindable {
        private _listeners: IBindableListener[];
        private _value: any;

        constructor() {
            this._listeners = [];
        }

        public getValue():any {
            return this._value;
        }

        public setValue(value: any) {
            this.notifyListeners(value, DataChangeReason.replace);
            this._value = value;
        }

        public addListener(listener: IBindableListener) {
            this._listeners.push(listener);
        }

        public removeListener(listener: IBindableListener) {
            var indexToRemove: number = -1;
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] == listener) {
                    indexToRemove = i;
                }
            }

            if (indexToRemove >= 0) {
                this._listeners.splice(indexToRemove, 1);
            }
        }

        public getListenersCount(): number {
            return this._listeners.length;
        }

        public getListener(index: number): IBindableListener {
            return this._listeners[index];
        }

        public notifyListeners(newValue:any, reason:DataChangeReason): void {
            for (var i = 0; i < this._listeners.length; i++) {
                var listener: IBindableListener = this._listeners[i];
                listener.valueChanged(this._value, newValue, reason);
            }
        }

        public hasValue(): boolean {
            if (this._value == null || this._value == undefined) {
                return false;
            }

            return true;
        }
    }
}