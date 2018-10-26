import {HtmlDefinition, View} from "./dom/view";

export class Application {
    render<TApplicationViewModel>(
        element: HTMLElement,
        view: { new(): View<TApplicationViewModel> },
        viewModel: TApplicationViewModel): void {

        const viewInstance = new view();

        const
            template = viewInstance.template(viewModel),
            transformedTemplate = this.transform(template);

        if (transformedTemplate !== null)
        {
            element.appendChild(transformedTemplate);
        }
    }

    private transform(source: HtmlDefinition): HTMLElement|null {
        if (typeof source.element === 'string') {
            let result = document.createElement(source.element);
            if (source.text) {
                result.innerText = source.text;
            }

            if (source.nested && source.nested.length > 0) {
                for (let i = 0; i < source.nested.length; i++){
                    let newChild = this.transform(source.nested[i]);
                    if (newChild !== null)
                    {
                        result.appendChild(newChild);
                    }
                }
            }

            return result;
        }

        return null;
    }
}