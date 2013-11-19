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

        public isEmpty(): boolean{
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
            if (text === undefined || text == null) {
                throw new Error("Could not append empty string!")
            }

            if (typeof text !== "string"){
                throw new Error("Expected string text but was" + text);
            }

            if (text === ""){
                this.getTarget().empty();
                return this;
            }

            var encodedHtml = $("<div/>").text(text).html();

            // todo: review it. appendText should not return anything
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
            var $markup;
            if (markup instanceof jQuery) {
                $markup = markup;
            } else {
                try {
                    $markup = $(markup);
                }
                catch(error) {
                    return markup;
                }

            }

            if ($markup.parent().length > 0){
                return $markup.html();
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
            context:JohnSmith.Common.IElement) : boolean {
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
    //JohnSmith.Common.JS.ioc.register("valueToElementMapper", new JQueryValueToElementMapper());
}

