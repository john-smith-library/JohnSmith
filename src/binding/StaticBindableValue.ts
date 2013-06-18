/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    export class StaticBindableValue implements IBindable {
        private value: any;

        constructor(value:any) {
            this.value = value;
        }

        public getValue(): any {
            return this.value;
        }

        public getState() {
            return "normal";
        }

        public addListener(listener: IBindableListener) {
        }

        public removeListener(listener: IBindableListener) {
        }
    }

    export class StaticBindableFactory implements IBindableFactory {
        public createBindable(bindable: any): IBindable {
            return new StaticBindableValue(bindable);
        }
    }
}