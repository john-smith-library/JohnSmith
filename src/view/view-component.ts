import { Disposable } from '../common';
import { DomElement, DomNode } from './element';
import { ViewRenderer } from './view-renderer';
import { DomEngine } from './dom-engine';

export type ViewComponentConstructor<T> = { new (data: T): ViewComponent<T> };

export interface ViewComponent<TData> {
  data?: TData;

  $$createBinding(
    parent: DomElement,
    placeholder: DomNode,
    renderer: ViewRenderer,
    domEngine: DomEngine
  ): Disposable;
}
