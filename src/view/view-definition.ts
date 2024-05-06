import { Listenable } from '../reactive';

import '../binding/default';
import { ViewComponentConstructor } from './view-component';

export type HtmlDefinitionElement = string | ViewComponentConstructor<unknown>;
export type NestedHtmlDefinition =
  | HtmlDefinition
  | string
  | Listenable<unknown>
  | number
  | {
      toString?: () => string;
    };
export type HtmlDefinitionAttributes = {
  [key: string]: any;
};

export interface HtmlDefinition {
  element: HtmlDefinitionElement;
  attributes: HtmlDefinitionAttributes | null;
  nested: NestedHtmlDefinition[];
  namespace?: string;
}

/**
 * Allows declaring a View as a class:
 *
 * ```typescript
 * [[include:view/view-definition-view-constructor.tsx]]
 * ```
 */
export type ViewConstructor<T> = { new (viewModel: T): View };
export type TemplateFactory<T> = (vm: T) => HtmlDefinition;
export type ViewDefinition<T> = ViewConstructor<T> | TemplateFactory<T>;

export interface View {
  template(): HtmlDefinition;
}
