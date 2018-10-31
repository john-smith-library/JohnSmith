import {Disposable} from '../../common';
import {Listenable} from '../../reactive';
import {ViewDefinition} from '../view';
import {ViewRenderer} from '../view-renderer';
import {DomElement} from '../element';

export class ObservableValueViewConnector implements Disposable {
    private _renderedValue:Disposable|null = null;
    private readonly _link:Disposable;

    constructor(
        source: Listenable<any>,
        private readonly target: DomElement,
        private readonly view: ViewDefinition<any>,
        private readonly _viewRenderer: ViewRenderer) {

        this._link = source.listen(value => this.doRender(value));
    }

    dispose(): void {
        this.disposeRenderedValue();
        this._link.dispose();
    }

    private doRender(value: any):void {
        this.disposeRenderedValue();
        if (value !== null)
        {
            this._renderedValue = this._viewRenderer.render(this.target, this.view, value);
        }
    }

    private disposeRenderedValue() {
        if (this._renderedValue !== null) {
            this._renderedValue.dispose();
            this._renderedValue = null;
        }
    }
}