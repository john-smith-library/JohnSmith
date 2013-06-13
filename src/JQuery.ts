/// <reference path="binding/Handling.ts"/>
/// <reference path="binding/Contracts.ts"/>
/// <reference path="binding/BindableManager.ts"/>
/// <reference path="Common.ts"/>

declare var $: any;
declare var jQuery: any;

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

        public appendHtml(html:string) : JohnSmith.Common.IElement{
            if (!html) {
                throw new Error("Could not append empty string!")
            }

            if (typeof html !== "string"){
                throw new Error("Expected string markup but was" + html);
            }

            var parsedHtml = $($.parseHTML(html));

            this.target.append(parsedHtml);
            return new JQueryElement(parsedHtml);
        }

        public appendText(text:string) : JohnSmith.Common.IElement{
            if (!text) {
                throw new Error("Could not append empty string!")
            }

            if (typeof text !== "string"){
                throw new Error("Expected string text but was" + text);
            }

            var encodedHtml = $("<div/>").text(text).html();
            return this.appendHtml(encodedHtml);
//            var result = $(encodedHtml)
//
//            this.target.append(result);
//            return new JQueryElement(result);
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

        public setText(text:string) {
            this.target.text(text);
        }

        public setHtml(html:string) {
            this.target.html(html);
        }

        public addClass(className: string) : void {
            this.target.addClass(className);
        }

        public removeClass(className: string) : void {
            this.target.removeClass(className);
        }

        public attachClickHandler(callback: () => void) : void {
            this.target.click(callback);
        }

        public getValue() : string {
            return this.target.val();
        }

        public setValue(value: string) : string{
            return this.target.val(value);
        }
    }

    export class JQueryMarkupResolver implements JohnSmith.Common.IMarkupResolver {
        public resolve(markup: any): string {
            var jqueryMarkup =
                markup instanceof jQuery ?
                markup : $(markup);

            if (jqueryMarkup.parent().length > 0){
                return jqueryMarkup.html();
            }

            if (typeof markup === "string") {
                return markup;
            }

            if (markup instanceof jQuery) {
                return $("<p>").append(markup).html();
            }

            throw new Error("Could not resolve markup by object " + markup);
        }
    }

    /////////////////////////////////
    // Configuring handler transformers
    /////////////////////////////////

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "{to: 'selector'} => {contentDestination: IElement} [Converts 'to' selector to DOM element]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0 && data[0].handler === "render" && data[0].to){
                return JohnSmith.Binding.TransformerApplicability.Applicable;
            }

            return JohnSmith.Binding.TransformerApplicability.Unknown;
        },

        transform: function(data: any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): any {
            var elementFactory:JohnSmith.Common.IElementFactory = <JohnSmith.Common.IElementFactory> JohnSmith.Common.JS.ioc.resolve("elementFactory");

            data[0].contentDestination = context == null ?
                elementFactory.createElement(data[0].to) :
                context.findRelative(data[0].to);

            return data;
        }
    }, true);

    JohnSmith.Common.JS.addHandlerTransformer({
        description: "'selector' => {to: 'selector', handler: 'render'} [Handles selector and converts it to object with 'to' property]",

        checkApplicability: function(data:any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): JohnSmith.Binding.TransformerApplicability{
            if (data && data.length > 0 && typeof data[0] == "string"){
                return JohnSmith.Binding.TransformerApplicability.Applicable;
            }

            return JohnSmith.Binding.TransformerApplicability.NotApplicable;
        },

        transform: function(data: any[], bindable:JohnSmith.Binding.IBindable, context:JohnSmith.Common.IElement): any {
            var lastDataItem = data[data.length - 1];
            var selector = data[0];
            if (JohnSmith.Common.TypeUtils.isObject(lastDataItem)){
                data[0] = lastDataItem;
                data.pop();
            } else {
                data[0] = {};
            }

            data[0].to = selector;
            if (!data[0].handler) {
                data[0].handler = 'render';
            }

            return data;
        }
    }, true);

    JohnSmith.Common.JS.addHandlerTransformer({
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

    JohnSmith.Common.JS.ioc.register(
        "elementFactory",
        {
            createElement: function(query:string){
                return new JQueryElement($(query))
            },
            createRelativeElement: function(parent:JohnSmith.Common.IElement, query:string){

            }
        }
    );

    JohnSmith.Common.JS.ioc.register("markupResolver", new JQueryMarkupResolver());
}

