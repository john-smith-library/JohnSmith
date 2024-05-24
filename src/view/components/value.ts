import { ViewDefinition } from '../view-definition';
import { Listenable } from '../../reactive';
import { ViewComponent } from '../view-component';
import { Disposable } from '../../common';
import { DomNode } from '../element';
import { ViewRenderer } from '../view-renderer';
import { AbstractListenableConnector } from '../connectors/abstract';
import { DomEngine } from '../dom-engine';

export interface ValueData<T> {
  view: ViewDefinition<T>;
  model: T | Listenable<T | null> | null;
}

/**
 * Connects a Value to a DOM HTML Element via rendering a View.
 * If the Value is listenable then the View will be re-rendered
 * on every Value change.
 *
 * If the Value is null or undefined the corresponding DOM Element
 * will be cleared.
 */
export class Value<T> implements ViewComponent<ValueData<T>> {
  data: ValueData<T>;

  constructor(data: ValueData<T>) {
    this.data = data;
  }

  public $$createBinding(
    placeholder: DomNode,
    renderer: ViewRenderer,
    domEngine: DomEngine
  ): Disposable {
    let actualPlaceholder = placeholder;
    let previousRoot: DomNode | null = null;

    return new AbstractListenableConnector<T>(
      this.data.model,
      (value: T | null | undefined) => {
        if (value !== null && value !== undefined) {
          const renderedView = renderer.render(
            actualPlaceholder,
            this.data.view,
            value
          );

          previousRoot = renderedView.root;

          return {
            dispose: () => {
              if (previousRoot != null) {
                actualPlaceholder = domEngine.createMarkerElement();
                previousRoot.insertAfter(actualPlaceholder);
              }

              renderedView.dispose();
            },
          };
        }

        return null;
      }
    );
  }
}
