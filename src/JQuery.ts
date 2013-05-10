/// <reference path="Binding.ts"/>

declare var $: any;

module JohnSmith.JQuery {
//    export class JQueryBindableHandlerTransformer implements JohnSmith.Binding.IHandlerFactory {
//        public createHandler(handler: any, context: JohnSmith.Common.IElement): JohnSmith.Binding.IBindableHandler {
//            var elementFactory:JohnSmith.Common.IElementFactory = js.ioc.resolve("elementFactory");
//
////            if (typeof handler == "string") {
////                return new JohnSmith.Binding.HandlerFactoryResult(
////                    null, {
////                        handler: "render",
////                        contentDestination: context == null ?
////                            elementFactory.createElement(handler) :
////                            context.findRelative(handler)
////                    });
////            }
//
////            if (handler && handler.handler && handler.to && (handler.handler == "render")) {
////                handler.contentDestination = context == null ?
////                    elementFactory.createElement(handler.to) :
////                    context.findRelative(handler.to);
////
////                return null;
////            }
//
////            if (handler && handler.handler && handler.to && handler.handler == "list") {
////                var contentDestination:JohnSmith.Binding.IListContentDestination = {
////                    empty: function(){
////                        $(handler.to).empty();
////                    },
////                    append: function(item: any, html: string){
////                        $(html)
////                            .data("dataItem", item)
////                            .addClass("dataItem")
////                            .appendTo($(handler.to));
////                    },
////                    remove: function(item: any){
////                        var elementsToDelete:any[] = [];
////                        $(handler.to)
////                            .find(".dataItem")
////                            .each(function(index, element){
////                                var $element = $(element);
////                                if ($element.data("dataItem") == item){
////                                    elementsToDelete.push($element);
////                                }
////                            });
////
////                        for (var i = 0; i < elementsToDelete.length; i++){
////                            elementsToDelete[i].remove();
////                        }
////                    }
////                };
////
////                handler.contentDestination = contentDestination;
////
////                return null;
////            }
//
//            return null;
//        }
//    }

    class JQueryElement implements JohnSmith.Common.IElement {
        private target:any;

        constructor (target:any){
            this.target = target;
        }

        public empty() : void{
            this.target.empty();
        }

        public append(html:string) : JohnSmith.Common.IElement{
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
        transform: function(data: any, context:JohnSmith.Common.IElement): any {
            if (data && data.handler && (data.handler === "render" || data.handler === "list") && data.to) {
                var elementFactory:JohnSmith.Common.IElementFactory = <JohnSmith.Common.IElementFactory> js.ioc.resolve("elementFactory");

                data.contentDestination = context == null ?
                    elementFactory.createElement(data.to) :
                    context.findRelative(data.to);
            }

            return data;
        }
    }, true);

    js.addHandlerTransformer({
        description: "'selector' => {to: 'selector', handler: 'render'} [Handles selector and converts it to object with 'to' property]",
        transform: function(data: any, context:JohnSmith.Common.IElement): any {
            if (typeof data == "string") {
                return {
                    to: data,
                    handler: 'render'
                };
            }

            return data;
        }
    }, true);

    js.addHandlerTransformer({
        description: "{handler: 'list'} => {handler: 'list', mapper: IValueToElementMapper} [Adds value to element mapper]",
        transform: function(data: any, context:JohnSmith.Common.IElement): any {
            if (data && data.handler === "list") {
                if (!data.mapper) {
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

                    data.mapper = mapper;
                }
            }

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

