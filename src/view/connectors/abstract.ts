import { Disposable } from '../../common';
import { BidirectionalListenable, Listenable } from '../../reactive';
import { isListenable } from '../../reactive';
import { DomElement } from '../element';

export class AbstractListenableConnector<T> implements Disposable {
  private _renderedValue: Disposable | null = null;
  private readonly _link: Disposable | null = null;

  constructor(
    source: Listenable<T | null> | T | null | undefined,
    private renderer: (value: T | null) => Disposable | null
  ) {
    if (source === null) {
      this.doRender(source);
    } else if (source !== undefined) {
      if (isListenable(source)) {
        this._link = source.listen(value => this.doRender(value));
      } else {
        this.doRender(source);
      }
    }
  }

  public dispose(): void {
    this.disposeRenderedValue();
    if (this._link) {
      this._link.dispose();
    }
  }

  private doRender(value: T | null): void {
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

export class AbstractBidirectionalConnector<
  T,
> extends AbstractListenableConnector<T> {
  private readonly _eventHandler: any;

  constructor(
    source:
      | BidirectionalListenable<T>
      | Listenable<T>
      | BidirectionalListenable<T | null>
      | Listenable<T | null>
      | T
      | null
      | undefined,
    private target: DomElement,
    valueFromDom: (target: DomElement) => T,
    valueToDom: (target: DomElement, value: T | null) => void,
    private event: string
  ) {
    super(source, (value: T | null) => {
      valueToDom(target, value);
      return null;
    });

    if (
      source &&
      (source as BidirectionalListenable<T>).requestUpdate !== undefined
    ) {
      const bidirectionalSource = source as BidirectionalListenable<T>;

      this._eventHandler = target.attachEventHandler(event, () => {
        bidirectionalSource.requestUpdate(valueFromDom(target));
      });
    }
  }

  public dispose(): void {
    super.dispose();
    if (this._eventHandler) {
      this.target.detachEventHandler(this.event, this._eventHandler);
    }
  }
}
