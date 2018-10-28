import {Listenable} from "../reactive";

export interface HtmlDefinition {
    element: any;
    attributes: { [key: string]: any };
    nested: (HtmlDefinition|string|Listenable<any>|any)[];
    //text?: string|null;
}

export interface View<T> {
    template(viewModel:T): HtmlDefinition;
}