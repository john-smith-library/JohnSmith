import {Disposable} from '../../common';
import {BidirectionalListenable, Listenable} from '../../reactive';
import {isListenable} from '../../reactive';
import {DomElement} from '../element';

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

export class AbstractBidirectionalConnector<T> extends AbstractListenableConnector<T> {
    private readonly eventHandler: any;

    constructor(
        source: BidirectionalListenable<T> | Listenable<T> | T,
        private target: DomElement,
        valueFromDom: (target: DomElement) => T|null,
        valueToDom: (target: DomElement, value:T|null) => void,
        private event: string) {

        super(source, (value: T|null) => {
            valueToDom(target, value);
            return null;
        });

        if (source && (<BidirectionalListenable<T>>source).requestUpdate !== undefined) {
            const bidirectionalSource = <BidirectionalListenable<T>>source;

            this.eventHandler = target.attachEventHandler(event, () => { bidirectionalSource.requestUpdate(valueFromDom(target))});
        }
    }

    dispose(): void {
        super.dispose();
        if (this.eventHandler) {
            this.target.detachEventHandler(this.event, this.eventHandler);
        }
    }
}