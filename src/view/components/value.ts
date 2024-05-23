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
          const rerenderedView = renderer.render(
            actualPlaceholder,
            this.data.view,
            value
          );

          previousRoot = rerenderedView.root;

          return {
            dispose: () => {
              if (previousRoot != null) {
                actualPlaceholder = domEngine.createMarkerElement();
                previousRoot.insertAfter(actualPlaceholder);
              }

              rerenderedView.dispose();
            },
          };
        }

        return null;
      }
    );
  }
}
