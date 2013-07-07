/// <reference path="../libs/jquery.d.ts"/>
/// <reference path="binding/Handling.ts"/>
/// <reference path="binding/Contracts.ts"/>
/// <reference path="binding/BindableManager.ts"/>
/// <reference path="binding/BindableList.ts"/>
/// <reference path="command/Contracts.ts"/>
/// <reference path="command/Integration.ts"/>
/// <reference path="Common.ts"/>

module JohnSmith.JQuery {
    class JQueryElement implements JohnSmith.Common.IElement {
        private _target:any;

        constructor (target:any){
            this._target = target;
        }

        public isEmpty(): bool{
            return this._target.length == 0;
        }

        public empty(): void{
            this._target.empty();
        }

        public appendHtml(html:string) : JohnSmith.Common.IElement{
            if (!html) {
                throw new Error("Could not append empty string!")
            }

            if (typeof html !== "string"){
                throw new Error("Expected string markup but was" + html);
            }

            var parsedHtml = $($.parseHTML(html));

            this._target.append(parsedHtml);
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
        }

        public getHtml() : string {
            return this._target.html();
        }

        public getNodeName(): string {
            if (this._target.length == 1) {
                return this._target[0].nodeName;
            }

            return null
        }

        public findRelative(query:string) : JohnSmith.Common.IElement {
            var result = this._target.filter(query);
            if (result.length == 0) {
                result = this._target.find(query);
            }

            return new JQueryElement(result);
        }

        public remove(): void {
            this._target.remove();
        }

        public getTarget(): any {
            return this._target;
        }

        public setText(text:string) {
            this._target.text(text);
        }

        public setHtml(html:string) {
            this._target.html(html);
        }

        public addClass(className: string) : void {
            this._target.addClass(className);
        }

        public removeClass(className: string) : void {
            this._target.removeClass(className);
        }

        public attachClickHandler(callback: () => void) : void {
            this._target.click(callback);
        }

        public attachEventHandler(event: string, callback: (target:Common.IElement) => void){
            var actualCallback = function () {
                callback(new JQueryElement($(this)));
                return false;
            };

            this._target.on(event, actualCallback);
            return actualCallback;
        }

        public detachEventHandler(event: string, handler: any) {
            this._target.off(event, handler);
        }

        public getValue() : string {
            return this._target.val();
        }

        public setValue(value: string) : string{
            return this._target.val(value);
        }

        public getAttribute(attribute: string) {
            return this._target.attr(attribute);
        }

        public setAttribute(attribute: string, value: string) {
            this._target.attr(attribute, value);
        }

        public getProperty(property: string):any {
            return this._target.prop(property);
        }

        public setProperty(property: string, value: any) {
            this._target.prop(property, value);
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

    class JQueryTargetArgumentProcessor implements JohnSmith.Common.IArgumentProcessor {
        public canProcess(
            argument:any,
            argumentIndex: number,
            options: any,
            context:JohnSmith.Common.IElement) : bool {
            return (typeof argument == "string") && argumentIndex == 0
        }

        public process(
            argument:any,
            options: any,
            context:JohnSmith.Common.IElement){

            if (!options.to){
                options.to = argument;
            }
        }
    }

    export class JQueryValueToElementMapper implements Binding.IValueToElementMapper {
        public getElementFor(value:any, root:JohnSmith.Common.IElement): JohnSmith.Common.IElement {
            var $items = (<JQueryElement> root.findRelative(".dataItem")).getTarget();
            for (var i = 0; i < $items.length; i++){
                var $element = $($items[i]);
                if ($element.data("dataItem") === value){
                    return new JQueryElement($element)
                }
            }

            return null;
        }

        public attachValueToElement(value:any, element:JohnSmith.Common.IElement): void {
            var $target = (<JQueryElement> element).getTarget();
            $target
                .addClass("dataItem")
                .data("dataItem", value);
        }
    }

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

    JohnSmith.Common.JS.addHandlerArgumentProcessor(new JQueryTargetArgumentProcessor());
    JohnSmith.Common.JS.addCommandCauseArgumentProcessor(new JQueryTargetArgumentProcessor());
    JohnSmith.Common.JS.ioc.register("markupResolver", new JQueryMarkupResolver());
    JohnSmith.Common.JS.ioc.register("valueToElementMapper", new JQueryValueToElementMapper());
}

