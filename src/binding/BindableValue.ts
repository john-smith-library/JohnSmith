/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    /**
     * Creates simple bindable value.
     */
    export class BindableValue implements IBindable {
        private _listeners: JohnSmith.Common.ArrayList;
        private _value: any;
        private _state: string;

        constructor() {
            this._listeners = new JohnSmith.Common.ArrayList();
        }

        public getValue():any {
            return this._value;
        }

        public setValue(value: any) {
            this.notifyListeners(value, DataChangeReason.replace);
            this._value = value;
        }

        public getState() {
            return this._state;
        }

        public setState(state: string) {
            for (var i = 0; i < this._listeners.count(); i++) {
                var listener: IBindableListener = this._listeners.getAt(i);
                listener.stateChanged(this._state, state);
            }

            this._state = state;
        }

        public addListener(listener: IBindableListener) {
            this._listeners.add(listener);
        }

        public removeListener(listener: IBindableListener) {
            var indexToRemove: number = -1;
            for (var i = 0; i < this._listeners.count(); i++) {
                if (this._listeners.getAt(i) == listener) {
                    indexToRemove = i;
                }
            }

            if (indexToRemove >= 0) {
                this._listeners.removeAt(indexToRemove);
            }
        }

        public getListenersCount(): number {
            return this._listeners.count();
        }

        public notifyListeners(newValue:any, reason:DataChangeReason): void {
            for (var i = 0; i < this._listeners.count(); i++) {
                var listener: IBindableListener = this._listeners.getAt(i);
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

    JohnSmith.Common.JS.bindableValue = function():JohnSmith.Binding.BindableValue {
        return new BindableValue();
    }
}