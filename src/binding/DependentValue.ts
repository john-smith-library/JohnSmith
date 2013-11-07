/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    export class DependentValue implements IBindable {
        private _listeners: JohnSmith.Common.ArrayList;
        private _evaluateValue: () => any;
        private _dependencies: IBindable[];

        constructor(evaluate: () => any, ...dependencies: IBindable[]) {

            var dependentValue = this;
            for (var i = 0; i < dependencies.length; i++) {
                var dependency = dependencies[i];
                dependency.addListener({
                    valueChanged: function(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
                        dependentValue.notifyListeners();
                    }
                });
            }

            this._dependencies = dependencies;
            this._evaluateValue = evaluate;
            this._listeners = new JohnSmith.Common.ArrayList();
        }

        public getValue():any {
            var actualDependencies: any[] = [];
            console.log(this._dependencies.length);
            for (var i = 0; i < this._dependencies.length; i++) {
                console.log(i + " = " + this._dependencies[i].getValue());
                actualDependencies.push(this._dependencies[i].getValue());
            }

            return this._evaluateValue.apply(this, actualDependencies);
        }

        public setValue(value: any) {
            throw Error("Could not set dependent value");
        }

        public getState() {
            return "";
        }

        // todo remove
        public setState(state: string) {
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

        public notifyListeners(): void {
            for (var i = 0; i < this._listeners.count(); i++) {
                var listener: IBindableListener = this._listeners.getAt(i);
                listener.valueChanged(null, this.getValue(), DataChangeReason.replace);
            }
        }
    }
}
