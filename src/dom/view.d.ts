export interface HtmlDefinition {
    element: string | Function;
    attributes: {
        [key: string]: string;
    };
    bindings: {
        [key: string]: string;
    };
    nested: HtmlDefinition[];
    text?: string | null;
}
export interface View<T> {
    template(viewModel: T): HtmlDefinition;
}
