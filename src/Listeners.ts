export class RenderValueListener<T> implements IManageable {
    private _currentValue: IRenderedValue;
    private _link: IDisposable;

    constructor(private _observable:IObservable<T>, private _contentDestination: IElement, private _renderer:IValueRenderer) {
    }

    public init(): void {
        this.doRender(this._observable.getValue());
        this._observable.listen((value: T) => this.doRender(value));
    }

    public dispose(): void {
        if (this._link) {
            this._link.dispose();
        }

        this.disposeCurrentValue();
    }

    private doRender(value: T):void {
        this.disposeCurrentValue();

        if (value !== null && value !== undefined) {
            this._currentValue = this._renderer.render(value, this._contentDestination);
        }
    }

    private disposeCurrentValue(){
        if (this._currentValue) {
            this._currentValue.dispose();
        }
    }
}
