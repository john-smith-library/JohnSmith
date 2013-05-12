/// <reference path="Binding.ts"/>

declare var $: any;

module JohnSmith.JQuery {
    class JQueryElement implements JohnSmith.Common.IElement {
        private target:any;

        constructor (target:any){
            this.target = target;
        }

        public isEmpty(): bool{
            return this.target.length == 0;
        }

        public empty(): void{
            this.target.empty();
        }

        public append(html:string) : JohnSmith.Common.IElement{
            if (!html) {
                return null;
            }

            var parsedHtml =
                typeof html === "string" ?
                $($.parseHTML(html)) : $(html);

            this.target.append(parsedHtml);
            return new JQueryElement(parsedHtml);
        }

        public getHtml() : string {
            return this.target.html();
        };

        public findRelative(query:string) : JohnSmith.Common.IElement {
            var result = this.target.filter(query);
            if (result.length == 0) {
                result = this.target.find(query);
            }

            return new JQueryElement(result);
        };

        public remove(): void {
            this.target.remove();
        }

        public getTarget(): any {
            return this.target;
        }
    }

    /////////////////////////////////
    // Configuring handler transformers
    /////////////////////////////////

    js.addHandlerTransformer({
        description: "{to: 'selector'} => {contentDestination: IElement} [Converts 'to' selector to DOM element]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0 && data[0].handler === "render" && data[0].to){
                return JohnSmith.Binding.TransformerApplicability.Applicable;
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): any {
            var elementFactory:JohnSmith.Common.IElementFactory = <JohnSmith.Common.IElementFactory> js.ioc.resolve("elementFactory");

            data[0].contentDestination = context == null ?
                elementFactory.createElement(data[0].to) :
                context.findRelative(data[0].to);

            return data;
        }
    }, true);

    js.addHandlerTransformer({
        description: "'selector' => {to: 'selector', handler: 'render'} [Handles selector and converts it to object with 'to' property]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0 && typeof data[0] == "string"){
                return JohnSmith.Binding.TransformerApplicability.Applicable;
            }

            return JohnSmith.Binding.TransformerApplicability.NotApplicable;
        },

        transform: function(data: any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): any {
            data[0] = {
                to: data[0],
                handler: 'render'
            };

            return data;
        }
    }, true);

    js.addHandlerTransformer({
        description: "{handler: 'list'} => {handler: 'list', mapper: IValueToElementMapper} [Adds value to element mapper]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0 && data[0].handler === "render" && data[0].type === "list"){
                if (data[0].mapper) {
                    return JohnSmith.Binding.TransformerApplicability.NotApplicable;
                }

                return JohnSmith.Binding.TransformerApplicability.Applicable;
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): any {
            var mapper:JohnSmith.Binding.IValueToElementMapper = {
                getElementFor: function(value:any, root:JohnSmith.Common.IElement):JohnSmith.Common.IElement {
                    var $items = (<JQueryElement> root.findRelative(".dataItem")).getTarget();
                    for (var i = 0; i < $items.length; i++){
                        var $element = $($items[i]);
                        if ($element.data("dataItem") === value){
                            return new JQueryElement($element)
                        }
                    }

                    return null;
                },

                attachValueToElement: function(value:any, element:JohnSmith.Common.IElement) {
                    var $target = (<JQueryElement> element).getTarget();
                    $target
                        .addClass("dataItem")
                        .data("dataItem", value);
                }
            };

            data[0].mapper = mapper;

            return data;
        }
    });

    /////////////////////////////////
    // Configuring ioc dependencies
    /////////////////////////////////

    js.ioc.register(
        "elementFactory",
        {
            createElement: function(query:string){
                return new JQueryElement($(query))
            },
            createRelativeElement: function(parent:JohnSmith.Common.IElement, query:string){

            }
        }
    );
}

