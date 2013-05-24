/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    /**
     * Creates simple bindable value.
     */
    export class BindableValue implements IBindable {
        private listeners: JohnSmith.Common.ArrayList;
        private value: any;
        private state: string;

        constructor() {
            this.listeners = new JohnSmith.Common.ArrayList();
        }

        public getValue():any {
            return this.value;
        }

        public setValue(value: any) {
            this.notifyListeners(value, DataChangeReason.replace);
            this.value = value;
        }

        public getState() {
            return this.state;
        }

        public setState(state: string) {
            for (var i = 0; i < this.listeners.count(); i++) {
                var listener: IBindableListener = this.listeners.getAt(i);
                listener.stateChanged(this.state, state);
            }

            this.state = state;
        }

        public addListener(listener: IBindableListener) {
            this.listeners.add(listener);
        }

        public removeListener(listener: IBindableListener) {
            var indexToRemove: number = -1;
            for (var i = 0; i < this.listeners.count(); i++) {
                if (this.listeners.getAt(i) == listener) {
                    indexToRemove = i;
                }
            }

            if (indexToRemove >= 0) {
                this.listeners.removeAt(indexToRemove);
            }
        }

        public getListenersCount(): number {
            return this.listeners.count();
        }

        public notifyListeners(newValue:any, reason:DataChangeReason): void {
            for (var i = 0; i < this.listeners.count(); i++) {
                var listener: IBindableListener = this.listeners.getAt(i);
                listener.valueChanged(this.value, newValue, reason);
            }
        }
    }

    JohnSmith.Common.JS.bindableValue = function():JohnSmith.Binding.BindableValue {
        return new BindableValue();
    }
}