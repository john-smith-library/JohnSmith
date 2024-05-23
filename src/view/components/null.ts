import { ViewDefinition } from '../view-definition';
import { Listenable } from '../../reactive';
import { ViewComponent } from '../view-component';
import { Disposable } from '../../common';
import { DomElement, DomNode } from '../element';
import { ViewRenderer } from '../view-renderer';
import { AbstractListenableConnector } from '../connectors/abstract';
import { DomEngine } from '../dom-engine';

export interface NullData<T> {
  view: ViewDefinition<void>;
  model: T | Listenable<T | null | undefined> | null | undefined;
}

export class Null<T> implements ViewComponent<NullData<T>> {
  data: NullData<T>;

  constructor(data: NullData<T>) {
    this.data = data;
  }

  public $$createBinding(
    parent: DomElement,
    placeholder: DomNode,
    renderer: ViewRenderer,
    domEngine: DomEngine
  ): Disposable {
    let actualPlaceholder = placeholder;
    let previousRoot: DomNode | null = null;

    return new AbstractListenableConnector<T | undefined>(
      this.data.model,
      (value: T | null | undefined) => {
        if (value !== null && value !== undefined) {
          return null;
        }

        const renderingResult = renderer.render(
          parent,
          actualPlaceholder,
          this.data.view,
          undefined
        );

        previousRoot = renderingResult.root;

        return {
          dispose: () => {
            if (previousRoot != null) {
              actualPlaceholder = domEngine.createMarkerElement();
              previousRoot.insertAfter(actualPlaceholder);
            }

            renderingResult.dispose();
          },
        };
      }
    );
  }
}
