import { Disposable } from '../../common';
import { Listenable } from '../../reactive';
import { ViewDefinition } from '../view-definition';
import { ViewRenderer } from '../view-renderer';
import { DomElement, DomNode } from '../element';
import { AbstractListenableConnector } from './abstract';

/**
 * Connects a Value to a DOM HTML Element via rendering a View.
 * If the Value is listenable then the View will be re-rendered
 * on every Value change.
 *
 * If the Value is null or undefined the corresponding DOM Element
 * will be cleared.
 */
export class ObservableValueViewConnector<T> implements Disposable {
  private _placeholder: DomNode | null = null;
  private _nestedConnector: Disposable;

  constructor(
    source: Listenable<T | null> | T | null | undefined,
    parent: DomElement,
    placeholder: DomNode,
    view: ViewDefinition<T>,
    viewRenderer: ViewRenderer
  ) {
    this._nestedConnector = new AbstractListenableConnector<T>(
      source,
      (value: T | null | undefined) => {
        if (value !== null && value !== undefined) {
          const rerenderedView = viewRenderer.render(
            parent,
            this._placeholder ?? placeholder,
            view,
            value
          );

          this._placeholder = rerenderedView.root ?? placeholder;

          return rerenderedView;
        }

        return null;
      }
    );
  }

  public dispose(): void {
    this._nestedConnector.dispose();
  }
}
