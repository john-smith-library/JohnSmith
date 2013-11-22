/// <reference path="Contracts.ts"/>

module JohnSmith.Binding {
    export class StaticBindableValue implements IBindable {
        private _value: any;

        constructor(value:any) {
            this._value = value;
        }

        public getValue(): any {
            return this._value;
        }

        public addListener(listener: IBindableListener) {
        }

        public removeListener(listener: IBindableListener) {
        }
    }
}