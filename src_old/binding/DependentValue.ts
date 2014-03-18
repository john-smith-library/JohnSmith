/// <reference path="Contracts.ts"/>
/// <reference path="BindableValue.ts"/>

module JohnSmith.Binding {
    export class DependentValue extends BindableValue {
        private _evaluateValue: () => any;
        private _dependencies: IBindable[];
        private _allDependencies: IBindable[];
        private _dependencyValues: any[];

        constructor(evaluate: () => any, dependencies: IBindable[]) {
            super();

            this._dependencies = dependencies;
            this._evaluateValue = evaluate;
            this._dependencyValues = [];
            this._allDependencies = [];

            for (var i = 0; i < dependencies.length; i++) {
                var dependency = dependencies[i];
                this.setupDependencyListener(dependency);
                this._dependencyValues[i] = dependency.getValue();
            }
        }

        // todo add dispose method

        public setupDependencyListener(dependency:IBindable){
            for (var i = 0; i < this._allDependencies.length; i++){
                if (this._allDependencies[i] === dependency){
                    return;
                }
            }

            this._allDependencies.push(dependency);

            var dependentValue = this;
            dependency.addListener({
                valueChanged: function(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
                    var actualValue = newValue;
                    if (changeType !== DataChangeReason.replace) {
                        actualValue = dependency.getValue();
                    }

                    dependentValue.notifyDependentListeners(dependency, actualValue);
                }
            });
        }

        public getValue():any {
            return this._evaluateValue.apply(this, this._dependencyValues);
        }

        public setValue(value: any) {
            throw Error("Could not set dependent value");
        }

        public notifyDependentListeners(causedByDependency:IBindable, newDependencyValue: any): void {
            var oldValue = this.getValue();
            for (var i = 0; i < this._dependencies.length; i++) {
                var dependency = this._dependencies[i];
                if (dependency === causedByDependency) {
                    this._dependencyValues[i] = newDependencyValue;
                }
            }

            var newValue = this.getValue();
            for (var i = 0; i < this.getListenersCount(); i++) {
                var listener: IBindableListener = this.getListener(i);
                listener.valueChanged(oldValue, newValue, DataChangeReason.replace);
            }
        }
    }


}
