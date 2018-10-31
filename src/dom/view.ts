import {Listenable} from "../reactive";

import '../binding/default';

export interface HtmlDefinition {
    element: any;
    attributes: { [key: string]: any };
    nested: (HtmlDefinition|string|Listenable<any>|any)[];
}

export type ViewConstructor<T> = { new(): View<T> };
export type ViewDefinition<T> = ViewConstructor<T>|((vm:T) => HtmlDefinition);

export interface View<T> {
    template(viewModel:T): HtmlDefinition;
}