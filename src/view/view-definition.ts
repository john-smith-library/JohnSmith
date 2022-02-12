import {Listenable} from "../reactive";

import '../binding/default';

export type NestedHtmlDefintion = (HtmlDefinition|string|Listenable<any>|any)[];

export interface HtmlDefinition {
    element: any;
    attributes: { [key: string]: any };
    nested: NestedHtmlDefintion;
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

export type RenderingContext = {
//    inner?: NestedHtmlDefintion
};

export interface View {
    template(renderingContext:RenderingContext): HtmlDefinition;
}
