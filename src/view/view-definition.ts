/**
 * @module view
 */

import {Listenable} from "../reactive";

import '../binding/default';

export type NestedHtmlDefintion = (HtmlDefinition|string|Listenable<any>|any)[];

export interface HtmlDefinition {
    element: any;
    attributes: { [key: string]: any };
    nested: NestedHtmlDefintion;
}

export type ViewConstructor<T> = { new(): View<T> };
export type ViewDefinition<T> = ViewConstructor<T>|((vm:T) => HtmlDefinition);
export type RenderingContext = { inner?: NestedHtmlDefintion };

export interface View<T> {
    template(viewModel:T, context: RenderingContext): HtmlDefinition;
}