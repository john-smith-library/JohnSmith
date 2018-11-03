import {Disposable} from '../../common';
import {Listenable} from '../../reactive';
import {isListenable} from '../../reactive';

export class AbstractListenableConnector<T> implements Disposable {
    private _renderedValue:Disposable|null = null;
    private readonly _link:Disposable|null = null;

    constructor(
        source: Listenable<T>|T,
        private renderer: (value: any) => Disposable|null) {

        if (isListenable(source)) {
            this._link = source.listen(value => this.doRender(value));
        } else {
            this.doRender(source);
        }
    }

    dispose(): void {
        this.disposeRenderedValue();
        if (this._link) {
            this._link.dispose();
        }
    }

    private doRender(value: any):void {
        this.disposeRenderedValue();
        this._renderedValue = this.renderer(value);
    }

    private disposeRenderedValue() {
        if (this._renderedValue !== null) {
            this._renderedValue.dispose();
            this._renderedValue = null;
        }
    }
}