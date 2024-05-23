import { ViewDefinition } from '../view-definition';
import { Listenable } from '../../reactive';
import { ViewComponent } from '../view-component';
import { DomElement, DomNode } from '../element';
import { ViewRenderer } from '../view-renderer';
import { Disposable } from '../../common';
import { ObservableListViewConnector } from '../connectors';
import { DomEngine } from '../dom-engine';

export interface ListData<T> {
  view: ViewDefinition<T>;
  model: T[] | Listenable<T[] | null> | null;
}

export class List<T> implements ViewComponent<ListData<T>> {
  data: ListData<T>;

  constructor(data: ListData<T>) {
    this.data = data;
  }

  public $$createBinding(
    placeholder: DomNode,
    renderer: ViewRenderer,
    domEngine: DomEngine
  ): Disposable {
    return new ObservableListViewConnector(
      this.data.model,
      placeholder,
      this.data.view,
      renderer,
      domEngine
    );
  }
}
