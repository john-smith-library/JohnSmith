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
        var formattedValue = this._formatter(Utils.isNullOrUndefined(value) ? '' : value);
        this.doRender(formattedValue, destination);

        return {
            dispose: () => { this.doRender('', destination); }
        };
    }

    /**
     * @abstract
     * @param formattedValue
     */
    public doRender(formattedValue:string, destination: IElement): void {}
}

/**
 * Appends encoded text to destination element.
 */
export class TextRenderer extends FormatterBasedRenderer {
    constructor(formatter:IValueFormatter){
        super(formatter);
    }

    public doRender(formattedValue:string, destination: IElement): void {
        destination.setText(formattedValue);
    }
}

/**
 * Appends html markup to destination element.
 */
export class HtmlRenderer extends FormatterBasedRenderer {
    constructor(formatter:IValueFormatter){
        super(formatter);
    }

    public doRender(formattedValue:string, destination: IElement): void {
        destination.setHtml(formattedValue);
    }
}

/**
 * Appends html markup to destination element.
 */
export class ResolvableMarkupRenderer extends FormatterBasedRenderer {
    private _markupResolver: IMarkupResolver;

    constructor(formatter:IValueFormatter, markupResolver:IMarkupResolver){
        super(formatter);
        this._markupResolver = markupResolver;
    }

    public doRender(formattedValue:string, destination: IElement): void {
        var markup = this._markupResolver.resolve(formattedValue);
        destination.setHtml(markup);
    }
}

export class ViewValueRenderer implements IValueRenderer {
    private _viewFactory: any;
    private _viewDescriptor: IViewFactory;

    constructor(viewFactory: IViewFactory, viewDescriptor: any, private _parent: IDomManager){
        this._viewFactory = viewFactory;
        this._viewDescriptor = viewDescriptor;
    }

    public render(value: any, destination: IElement): IRenderedValue {
        if (Utils.isNullOrUndefined(value)) {
            return DisposingUtils.noopDisposable;
        }

        var currentView = this._viewFactory.resolve(destination, this._viewDescriptor, value, this._parent);
        currentView.init();

        return {
            dispose: function(){
                currentView.dispose();
            }
        };
    }
}

export class FetcherToRendererAdapter implements IValueRenderer {
    private _fetcher:IFetcher;

    constructor(fetcher:IFetcher){
        this._fetcher = fetcher;
    }

    public render(formattedValue:string, destination: IElement) : IRenderedValue {
        this._fetcher.valueToElement(formattedValue, destination);
        return DisposingUtils.noopDisposable;
    }
}
