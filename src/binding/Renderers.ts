/// <reference path="../Common.ts"/>
/// <reference path="Contracts.ts"/>
/// <reference path="Handling.ts"/>

module JohnSmith.Binding {
    export class RendererBase implements IValueRenderer {
        private _formatter:IValueFormatter;

        constructor(formatter:IValueFormatter){
            this._formatter = formatter;
        }

        public render(value: any, destination: Common.IElement) : Common.IElement {
            var formattedValue = this._formatter.format(value);
            return this.doRender(formattedValue, destination);
        }

        /**
         * @abstract
         * @param formattedValue
         */
        public doRender(formattedValue:string, destination: Common.IElement) : Common.IElement {
            return null;
        }
    }

    /**
     * Appends encoded text to destination element.
     */
    export class TextRenderer extends RendererBase {
        constructor(formatter:IValueFormatter){
            super(formatter);
        }

        public doRender(formattedValue:string, destination: Common.IElement) : Common.IElement {
            return destination.appendText(formattedValue);
        }
    }

    /**
     * Appends html markup to destination element.
     */
    export class HtmlRenderer extends RendererBase {
        constructor(formatter:IValueFormatter){
            super(formatter);
        }

        public doRender(formattedValue:string, destination: Common.IElement) : Common.IElement {
            return destination.appendHtml(formattedValue);
        }
    }

    /**
     * Appends html markup to destination element.
     */
    export class ResolvableMarkupRenderer extends RendererBase {
        private _markupResolver:Common.IMarkupResolver;

        constructor(formatter:IValueFormatter, markupResolver:Common.IMarkupResolver){
            super(formatter);
            this._markupResolver = markupResolver;
        }

        public doRender(formattedValue:string, destination: Common.IElement) : Common.IElement {
            var markup = this._markupResolver.resolve(formattedValue);
            return destination.appendHtml(markup);
        }
    }

    /**
     * Sets input element value (value attribute).
     */
    export class InputValueRenderer extends RendererBase {
        constructor(formatter:IValueFormatter){
            super(formatter);
        }

        public doRender(value: any, destination: JohnSmith.Common.IElement) : JohnSmith.Common.IElement {
            var currentValue = destination.getValue();
            if (currentValue !== value){
                destination.setValue(value);
            }

            return destination;
        }
    }

    export class CheckedAttributeRenderer implements IValueRenderer {
        public render(value: any, destination: JohnSmith.Common.IElement) : JohnSmith.Common.IElement {
            var currentValue = destination.getAttribute("checked");
            if (currentValue !== value){
                destination.setAttribute("checked", value);
            }

            return destination;
        }
    }
}