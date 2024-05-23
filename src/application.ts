import { DomElement, ViewDefinition } from './view';
import { DomEngine } from './view/dom-engine';
import { BindingRegistry, DefaultBindingRegistry } from './binding/registry';
import type { ViewRenderer } from './view/view-renderer';
import { NativeDomEngine } from './view/dom-engine-native';
import { Disposable } from './common';
import { DefaultViewRenderer } from './view/default-view-renderer';
import { Troubleshooter } from './troubleshooting/troubleshooter';
import { NoopTroubleshooter } from './troubleshooting/noop-troubleshooter';

import './troubleshooting/global';

/**
 * Represents main framework entry point.
 */
export class Application {
  private readonly _domEngine: DomEngine;
  private readonly _bindingRegistry: BindingRegistry;
  private readonly _viewRenderer: ViewRenderer;
  private readonly _troubleshooter: Troubleshooter;

  constructor(options?: {
    domEngine?: DomEngine;
    bindingRegistry?: BindingRegistry;
    viewRenderer?: ViewRenderer;
    troubleshooter?: Troubleshooter;
  }) {
    this._domEngine = options?.domEngine ?? new NativeDomEngine();
    this._bindingRegistry =
      options?.bindingRegistry ?? new DefaultBindingRegistry();
    this._troubleshooter =
      options?.troubleshooter ??
      (JS.TroubleShooterFactory
        ? JS.TroubleShooterFactory()
        : new NoopTroubleshooter());
    this._viewRenderer =
      options?.viewRenderer ??
      new DefaultViewRenderer(
        this._domEngine,
        this._bindingRegistry,
        this._troubleshooter
      );
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
  public render<TApplicationViewModel>(
    element: HTMLElement | string,
    view: ViewDefinition<TApplicationViewModel>,
    viewModel: TApplicationViewModel
  ): Disposable {
    const actualElement: DomElement | null =
      this._domEngine.resolveElement(element);
    if (actualElement !== null) {
      const placeholder = this._domEngine.createMarkerElement();
      actualElement.appendChild(placeholder);
      return this._viewRenderer.render(
        //actualElement,
        placeholder,
        view,
        viewModel
      );
    }

    return this._troubleshooter.elementNotFound(
      element,
      this._domEngine.getRoot()
    );
  }
}
