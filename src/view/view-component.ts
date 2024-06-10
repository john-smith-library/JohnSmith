import { Disposable } from '../common';
import { DomMarker } from './element';
import { ViewRenderer } from './view-renderer';
import { DomEngine } from './dom-engine';

export type ViewComponentConstructor<T> = { new (data: T): ViewComponent<T> };

export interface ViewComponent<TData> {
  data?: TData;
  markerId?: string;

  $$createBinding(
    placeholder: DomMarker,
    renderer: ViewRenderer,
    domEngine: DomEngine
  ): Disposable;
}
