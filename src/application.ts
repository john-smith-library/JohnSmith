import {DomElement, ViewDefinition} from "./view";
import {DomEngine} from "./view/dom-engine";
import {BindingRegistry, DefaultBindingRegistry} from "./binding/registry";
import type { ViewRenderer } from "./view/view-renderer";
import {NativeDomEngine} from "./view/dom-engine-native";
import {Disposable} from "./common";
//import { JxsInitializer } from './view/jsx/initializer';
import {DefaultViewRenderer} from "./view/default-view-renderer";
import {Troubleshooter} from "./troubleshooting/troubleshooter";
import {NoopTroubleshooter} from "./troubleshooting/noop-troubleshooter";

import './view/globals';

/**
 * Represents main framework entry point.
 */
export class Application {
    private readonly _domEngine: DomEngine;
    private readonly _bindingRegistry: BindingRegistry;
    private readonly _viewRenderer: ViewRenderer;
    private readonly _troubleshooter: Troubleshooter;

    constructor(
        domEngine?: DomEngine,
        bindingRegistry?: BindingRegistry,
        viewRenderer?: ViewRenderer,
        troubleshooter?: Troubleshooter) {

        this._domEngine = domEngine || new NativeDomEngine();
        this._bindingRegistry = bindingRegistry || new DefaultBindingRegistry();
        this._troubleshooter = troubleshooter || ((<any>JS).Troubleshooter) || new NoopTroubleshooter();
        this._viewRenderer = viewRenderer || new DefaultViewRenderer(
            this._domEngine,
            this._bindingRegistry,
            this._troubleshooter);
    }

    /**
     * Renders the View to the provided DOM element.
     *
     * @param element DOM element or id to use as a View content placeholder.
     * @param view the View Definition to render.
     * @param viewModel the View Model to pass to the View.
     *
     * @return rendered View instance, can be disposed to unrender the View.
     */
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
