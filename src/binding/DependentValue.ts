/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    export class DependentValue implements IBindable {
        private _listeners: JohnSmith.Common.ArrayList;
        private _evaluateValue: () => any;
        private _dependencies: IBindable[];
        private _dependencyValues: any[];

        constructor(evaluate: () => any, dependencies: IBindable[]) {
            this._dependencies = dependencies;
            this._evaluateValue = evaluate;
            this._listeners = new JohnSmith.Common.ArrayList();
            this._dependencyValues = [];


            for (var i = 0; i < dependencies.length; i++) {
                var dependency = dependencies[i];
                this.setupDependencyListener(dependency);
                this._dependencyValues[i] = dependency.getValue();
            }
        }

        private setupDependencyListener(dependency:IBindable){
            var dependentValue = this;
            dependency.addListener({
                valueChanged: function(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
                    dependentValue.notifyListeners(dependency, newValue);
                }
            });
        }

        public getValue():any {
            return this._evaluateValue.apply(this, this._dependencyValues);
        }

        public setValue(value: any) {
            throw Error("Could not set dependent value");
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

        public notifyListeners(causedByDependency:IBindable, newDependencyValue: any): void {
            for (var i = 0; i < this._dependencies.length; i++) {
                var dependency = this._dependencies[i];
                if (dependency === causedByDependency) {
                    this._dependencyValues[i] = newDependencyValue;
                }
            }

            for (var i = 0; i < this._listeners.count(); i++) {
                var listener: IBindableListener = this._listeners.getAt(i);
                listener.valueChanged(null, this.getValue(), DataChangeReason.replace);
            }
        }
    }

    JohnSmith.Common.JS.dependentValue = function (...args: any[]):JohnSmith.Binding.DependentValue {
        var dependencies:IBindable[] = [];
        for (var i = 0; i < args.length - 1; i++) {
            dependencies.push(args[i]);
        }

        return new DependentValue(args[args.length - 1], dependencies);
    }
}
