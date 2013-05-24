/// <reference path="Contracts.ts"/>
/// <reference path="BindableManager.ts"/>

module JohnSmith.Binding {
    export class CallbackHandler implements IBindableHandler, IBindableListener {
        private callback: (value:any, oldValue:any, changeType: DataChangeReason) => void;

        constructor(callback: (value:any, oldValue:any, changeType: DataChangeReason) => void){
            this.callback = callback;
        }

        public wireWith(bindable: IBindable) {
            bindable.addListener(this);
        }

        public unwireWith(bindable: IBindable) {
            bindable.removeListener(this);
        }

        public valueChanged(oldValue: Object, newValue: Object, changeType: DataChangeReason) {
            this.callback(newValue, oldValue, changeType);
        }

        public dispose(): void {
        }
    }

    JohnSmith.Common.JS.addHandlerFactory({
        createHandler: function (data: any, context: JohnSmith.Common.IElement): IBindableHandler {
            if (data && data.handler === "callback") {
                return new CallbackHandler(data.callback);
            }

            return null;
        }
    });

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "function => {handler: 'callback'}",

        checkApplicability: function(data:any[], bindable:IBindable, context:JohnSmith.Common.IElement): TransformerApplicability {
            if (data && data.length > 0){
                var firstArgument = data[0];
                if (JohnSmith.Common.TypeUtils.isFunction(firstArgument)){
                    return TransformerApplicability.Applicable;
                }
            }

            return TransformerApplicability.NotApplicable;
        },

        transform: function(data: any[], bindable:IBindable, context: JohnSmith.Common.IElement): any{
            data[0] = {
                handler: "callback",
                callback: data[0]
            };

            return data;
        }
    });
}