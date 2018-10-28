import {HtmlDefinition, View, DomElement} from "./dom";
import {DomEngine} from "./dom/dom-engine";
import {BindingRegistry, DefaultBindingRegistry} from "./binding/registry";
import {DefaultViewRenderer, ViewRenderer} from "./dom/view-renderer";
import {NativeDomEngine} from "./dom/dom-engine-native";
import {Disposable} from "./common";

export class Application {
    private _domEngine: DomEngine;
    private _bindingRegistry: BindingRegistry;
    private _viewRenderer: ViewRenderer;

    constructor(
        domEngine?: DomEngine,
        bindingRegistry?: BindingRegistry,
        viewRenderer?: ViewRenderer) {

        this._domEngine = domEngine || new NativeDomEngine();
        this._bindingRegistry = bindingRegistry || new DefaultBindingRegistry();
        this._viewRenderer = viewRenderer || new DefaultViewRenderer(this._domEngine, this._bindingRegistry);
    }

    render<TApplicationViewModel>(
        element: HTMLElement|string,
        view: { new(): View<TApplicationViewModel> },
        viewModel: TApplicationViewModel): Disposable {

        const actualElement: DomElement|null = this._domEngine.resolveElement(element);
        if (actualElement !== null) {
            return this._viewRenderer.render(actualElement, view, viewModel);
        }

        // todo: error

        return { dispose: () => {} }; // todo

        // const viewInstance = new view();
        //
        // const
        //     template = viewInstance.template(viewModel),
        //     transformedTemplate = this.transform(template);
        //
        // if (transformedTemplate !== null)
        // {
        //     element.appendChild(transformedTemplate);
        // }
    }

    // private transform(source: HtmlDefinition): HTMLElement|null {
    //     if (typeof source.element === 'string') {
    //         let result = document.createElement(source.element);
    //         if (source.text) {
    //             result.innerText = source.text;
    //         }
    //
    //         if (source.nested && source.nested.length > 0) {
    //             for (let i = 0; i < source.nested.length; i++){
    //                 let newChild = this.transform(source.nested[i]);
    //                 if (newChild !== null)
    //                 {
    //                     result.appendChild(newChild);
    //                 }
    //             }
    //         }
    //
    //         if (source.bindings['$text']) {
    //             source.bindings['$text'].listen(value => {
    //                 result.innerText = value;
    //             });
    //         }
    //
    //         if (source.attributes && source.attributes['_click']) {
    //             result.addEventListener('click', () => { source.attributes['_click'](); })
    //         }
    //
    //         return result;
    //     }
    //
    //     if (typeof source.element === 'function') {
    //
    //     }
    //
    //     return null;
    // }
}