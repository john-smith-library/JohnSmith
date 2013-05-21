/// <reference path="Contracts.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>

module JohnSmith.Binding {
    export interface StateTransitionHandlerItem {
        isMatched: (oldState: string, newState: string) => bool;
        handle: (oldState: string, newState: string) => void;
    }

    export class StateTransitionHandler implements IBindableHandler, IBindableListener {
        private items:JohnSmith.Common.IList;

        constructor (...args:StateTransitionHandlerItem[]){
            this.items = new JohnSmith.Common.ArrayList();
            for (var i = 0; i < args.length; i++){
                this.items.add(args[i])
            }
        }

        public wireWith(bindable: IBindable) {
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
        }

        public stateChanged(oldState: string, newState: string) {
            for (var i = 0; i < this.items.count(); i++){
                var item:StateTransitionHandlerItem = this.items.getAt(i);
                if (item.isMatched(oldState, newState)){
                    item.handle(oldState, newState);
                }
            }
        }

        public dispose():void {
            this.items.clear();
        }
    }
}