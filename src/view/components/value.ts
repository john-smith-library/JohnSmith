import { ViewDefinition } from '../view-definition';
import { Listenable } from '../../reactive';
import { ViewComponent } from '../view-component';
import { Disposable } from '../../common';
import { ObservableValueViewConnector } from '../connectors';
import { DomElement } from '../element';
import { ViewRenderer } from '../view-renderer';

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
    parent: DomElement,
    renderer: ViewRenderer
  ): Disposable {
    return new ObservableValueViewConnector(
      this.data.model,
      parent,
      this.data.view,
      renderer
    );
  }
}
