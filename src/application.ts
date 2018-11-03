import {HtmlDefinition, View, DomElement, ViewDefinition} from "./view";
import {DomEngine} from "./view/dom-engine";
import {BindingRegistry, DefaultBindingRegistry} from "./binding/registry";
import {DefaultViewRenderer, ViewRenderer} from "./view/view-renderer";
import {NativeDomEngine} from "./view/dom-engine-native";
import {Disposable} from "./common";
import { JxsInitializer } from './view/jsx/initializer';

export class Application {
    private readonly _domEngine: DomEngine;
    private readonly _bindingRegistry: BindingRegistry;
    private readonly _viewRenderer: ViewRenderer;

    constructor(
        domEngine?: DomEngine,
        bindingRegistry?: BindingRegistry,
        viewRenderer?: ViewRenderer) {

        this._domEngine = domEngine || new NativeDomEngine();
        this._bindingRegistry = bindingRegistry || new DefaultBindingRegistry();
        this._viewRenderer = viewRenderer || new DefaultViewRenderer(this._domEngine, this._bindingRegistry);

        JxsInitializer();
    }

    render<TApplicationViewModel>(
        element: HTMLElement|string,
        view: ViewDefinition<TApplicationViewModel>,
        viewModel: TApplicationViewModel): Disposable {

        const actualElement: DomElement|null = this._domEngine.resolveElement(element);
        if (actualElement !== null) {
            return this._viewRenderer.render(actualElement, view, viewModel);
        }

        // todo: error

        return { dispose: () => {} }; // todo
    }
}