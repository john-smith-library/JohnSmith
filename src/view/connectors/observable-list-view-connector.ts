import { Disposable } from '../../common';
import {
  DataChangeReason,
  isListenable,
  isPartialListenable,
  Listenable,
} from '../../reactive';
import { DomNode } from '../element';
import { ViewDefinition } from '../view-definition';
import { ViewRenderer } from '../view-renderer';
import { DomEngine } from '../dom-engine';

interface IRenderedValueData<T> {
  value: T;
  renderedValue: Disposable & { root: DomNode | null };
}

/**
 * Connects an observable list object to an HTML element.
 * Renders changed lists items on observable updates.
 */
export class ObservableListViewConnector<T> implements Disposable {
  private readonly _link: Disposable | null = null;

  /**
   * @internal
   * @private
   */
  private _renderedValues: IRenderedValueData<T>[];
  private _initialPlaceholder: DomNode;

  constructor(
    observable: Listenable<T[] | null> | T[] | null,
    contentDestination: DomNode,
    private readonly viewDefinition: ViewDefinition<T>,
    private readonly viewRenderer: ViewRenderer,
    private readonly domEngine: DomEngine
  ) {
    this._renderedValues = [];
    this._initialPlaceholder = contentDestination;

    if (observable != null) {
      if (isPartialListenable(observable)) {
        this._link = observable.listenPartial((portion, reason) => {
          this.doRender(portion || [], reason);
        });
      } else if (isListenable(observable)) {
        this._link = observable.listen(value => {
          this.doRender(value || [], DataChangeReason.replace);
        });
      } else {
        this.doRender(observable, DataChangeReason.replace);
      }
    }
  }

  public dispose(): void {
    if (this._link) {
      this._link.dispose();
    }

    for (let i = 0; i < this._renderedValues.length; i++) {
      this._renderedValues[i].renderedValue.dispose();
    }
  }

  private findRenderedValue(
    value: T
  ): (Disposable & { root: DomNode | null }) | null {
    for (let i = 0; i < this._renderedValues.length; i++) {
      const renderedItem = this._renderedValues[i];
      if (renderedItem.value === value) {
        return renderedItem.renderedValue;
      }
    }

    return null;
  }

  private removeRenderedValue(renderedValue: Disposable): void {
    let indexToRemove = -1;
    for (let i = 0; i < this._renderedValues.length; i++) {
      if (this._renderedValues[i].renderedValue === renderedValue) {
        indexToRemove = i;
      }
    }

    if (indexToRemove >= 0) {
      this._renderedValues.splice(indexToRemove, 1);
    }
  }

  private doRender(value: T[], reason: DataChangeReason): void {
    let i;

    if (reason == DataChangeReason.remove) {
      for (i = 0; i < value.length; i++) {
        const item = value[i];
        const itemRenderedValue = this.findRenderedValue(item);

        if (itemRenderedValue) {
          if (this._renderedValues.length === 1) {
            this._initialPlaceholder = this.domEngine.createMarkerElement();
            itemRenderedValue.root!.insertAfter(this._initialPlaceholder);
          }

          itemRenderedValue.dispose();
          this.removeRenderedValue(itemRenderedValue);
        }
      }
    } else if (reason == DataChangeReason.add) {
      this.appendItems(value);
    } else {
      if (this._renderedValues.length > 0) {
        this._initialPlaceholder = this.domEngine.createMarkerElement();
        this._renderedValues[
          this._renderedValues.length - 1
        ].renderedValue.root!.insertAfter(this._initialPlaceholder);
      }

      for (i = 0; i < this._renderedValues.length; i++) {
        this._renderedValues[i].renderedValue.dispose();
      }

      this._renderedValues = [];
      this.appendItems(value);
    }
  }

  private appendItems(items: T[]): void {
    if (!items) {
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const itemRenderedValue = this.viewRenderer.render(
        this.getNextItemPlaceholder(),
        this.viewDefinition,
        item
      );

      // if (itemRenderedValue.root !== null) {
      //   this._lastRenderedView = itemRenderedValue.root;
      //   // this.contentDestination = this.domEngine.createMarkerElement();
      //   // itemRenderedValue.root.insertAfter(this.contentDestination);
      // }

      this._renderedValues.push({
        value: item,
        renderedValue: itemRenderedValue,
      });
    }
  }

  private getNextItemPlaceholder(): DomNode {
    if (this._renderedValues.length !== 0) {
      const lastRendered =
        this._renderedValues[this._renderedValues.length - 1];

      if (lastRendered.renderedValue.root !== null) {
        const result = this.domEngine.createMarkerElement();
        lastRendered.renderedValue.root.insertAfter(result);
        return result;
      }
    }

    return this._initialPlaceholder;
  }
}
