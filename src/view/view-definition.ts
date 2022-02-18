/**
 * @module view
 */
 
import {Listenable} from "../reactive";

import '../binding/default';

export type NestedHtmlDefinition = (HtmlDefinition|string|Listenable<any>|any)[];

export interface HtmlDefinition {
    element: any;
    attributes: { [key: string]: any };
    nested: NestedHtmlDefinition;
}

/**
 * Allows declaring a View as a class:
 *
 * ```typescript
 * [[include:view/view-definition-view-constructor.tsx]]
 * ```
 */
export type ViewConstructor<T> = { new(viewModel:T): View };
export type TemplateFactory<T> = (vm:T) => HtmlDefinition;
export type ViewDefinition<T> = ViewConstructor<T>|TemplateFactory<T>;

export interface View {
    template(): HtmlDefinition;
}
