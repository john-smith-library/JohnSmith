/**
 * Converts a value to string representation.
 */
export interface IValueFormatter {
    (value: any): string;
}

/**
 * Represents rendered value
 */
export interface IRenderedValue extends IDisposable {
    /**
     * A target DOM element this rendered value attached to.
     */
    element: IElement;
}

/**
 * Renders value to DOM element.
 */
export interface IValueRenderer {
    render(value: any, destination: IElement): IRenderedValue;
}

/**
 * A base class for formatting-based renderers.
 * @abstract
 */
export class FormatterBasedRenderer implements IValueRenderer {
    private _formatter:IValueFormatter;

    constructor(formatter:IValueFormatter){
        this._formatter = formatter;
    }

    public render(value: any, destination: IElement) : IRenderedValue {
        var formattedValue = this._formatter(value);
        return {
            element: this.doRender(formattedValue, destination),
            dispose: function(){
                this.element.remove();
            }
        };
    }

    /**
     * @abstract
     * @param formattedValue
     */
    public doRender(formattedValue:string, destination: IElement) : IElement {
        return null;
    }
}

/**
 * Appends encoded text to destination element.
 */
export class TextRenderer extends FormatterBasedRenderer {
    constructor(formatter:IValueFormatter){
        super(formatter);
    }

    public doRender(formattedValue:string, destination: IElement) : IElement {
        return destination.appendText(formattedValue);
    }
}

/**
 * Appends html markup to destination element.
 */
export class HtmlRenderer extends FormatterBasedRenderer {
    constructor(formatter:IValueFormatter){
        super(formatter);
    }

    public doRender(formattedValue:string, destination: IElement) : IElement {
        return destination.appendHtml(formattedValue);
    }
}
