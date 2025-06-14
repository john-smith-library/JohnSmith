import { DomElement, DomMarker, DomNode } from './element';
import { Disposable, IsDisposable, Owner, ToDisposable } from '../common';
import {
  HtmlDefinition,
  NestedHtmlDefinition,
  TemplateFactory,
  ViewDefinition,
} from './view-definition';
import { DomEngine } from './dom-engine';
import { BindingRegistry } from '../binding/registry';
import { Listenable } from '../reactive';
import {
  ListenableAttributeConnector,
  ListenableTextConnector,
  PossiblyFormattable,
} from './connectors';

import '../binding/default';
import { OnBeforeInit, OnInit, OnUnrender } from './hooks';
import { ViewComponent, ViewComponentConstructor } from './view-component';
import { RenderedView, ViewRenderer } from './view-renderer';
import { Troubleshooter } from '../troubleshooting/troubleshooter';

type ViewRuntimeData = { template: HtmlDefinition; viewInstance?: unknown };
type Initializers = (() => Disposable)[];
type TraversingContext = { viewInstance: unknown; viewModel: unknown };

export class DefaultViewRenderer implements ViewRenderer {
  constructor(
    private domEngine: DomEngine,
    private bindingRegistry: BindingRegistry,
    private troubleshooter: Troubleshooter
  ) {}

  /**
   * @inheritDoc
   */
  public render<ViewModel>(
    placeholder: DomMarker,
    view: ViewDefinition<ViewModel>,
    viewModel: ViewModel
  ): RenderedView {
    const viewRuntime = DefaultViewRenderer.createViewRuntime(view, viewModel);
    const template = viewRuntime.template;
    const initializers: Initializers = [];
    const context: TraversingContext = {
      viewInstance: viewRuntime.viewInstance,
      viewModel: viewModel,
    };
    const transformedTemplate = this.transformElementsRecursively(
      null,
      template,
      initializers,
      context,
      undefined
    );

    const result = new Owner();

    if (transformedTemplate !== null) {
      if (transformedTemplate.isMarker) {
        placeholder.insertAfter(transformedTemplate);
        result.own({
          dispose: () => {
            placeholder.remove();
          },
        });
      } else {
        placeholder.replaceWith(transformedTemplate);
        result.own({
          dispose: () => {
            transformedTemplate.remove();
          },
        });
      }
    }

    const hooksRoot: DomElement | null =
      transformedTemplate !== null &&
      (transformedTemplate as DomElement).setInnerHtml !== undefined
        ? (transformedTemplate as DomElement)
        : null;

    /**
     * On Before Init
     */
    const onBeforeInitViewInstance = context.viewInstance as OnBeforeInit;
    if (onBeforeInitViewInstance && onBeforeInitViewInstance.onBeforeInit) {
      result.ownIfNotNull(
        ToDisposable(
          onBeforeInitViewInstance.onBeforeInit(hooksRoot, this.domEngine)
        )
      );
    }

    for (let i = initializers.length - 1; i >= 0; i--) {
      result.own(initializers[i]());
    }

    /**
     * On Init
     */
    const onInitViewInstance = context.viewInstance as OnInit;
    if (onInitViewInstance && onInitViewInstance.onInit) {
      result.ownIfNotNull(
        ToDisposable(onInitViewInstance.onInit(hooksRoot, this.domEngine))
      );
    }

    if (IsDisposable(context.viewInstance)) {
      result.own(context.viewInstance);
    }

    /**
     * On Unrender
     */
    const onUnrenderViewInstance = context.viewInstance as OnUnrender;
    if (onUnrenderViewInstance && onUnrenderViewInstance.onUnrender) {
      return {
        root: transformedTemplate ?? placeholder,
        dispose: () => {
          onUnrenderViewInstance.onUnrender(
            () => {
              result.dispose();
            },
            hooksRoot,
            this.domEngine
          );
        },
      };
    }

    return {
      root:
        transformedTemplate === null || transformedTemplate.isMarker
          ? placeholder
          : transformedTemplate,

      //transformedTemplate?.isMarker ? placeholder : transformedTemplate!, //transformedTemplate ?? placeholder,
      dispose: () => {
        result.dispose();
      },
    };
  }

  /**
   * @internal
   */
  private static createViewRuntime<ViewModel>(
    viewDefinition: ViewDefinition<ViewModel>,
    viewModel: ViewModel
  ): ViewRuntimeData {
    const viewDefinitionUntyped = viewDefinition as any;

    const viewDefinitionIsAnArrowFunction: boolean =
      typeof viewDefinition === 'function' &&
      viewDefinition.prototype === undefined;

    if (viewDefinitionIsAnArrowFunction) {
      const instance = (viewDefinition as TemplateFactory<ViewModel>)(
        viewModel
      );

      return {
        template: instance,
        viewInstance: instance,
      };
    }

    const instance = new viewDefinitionUntyped(viewModel);

    if (instance.template) {
      return {
        template: instance.template(),
        viewInstance: instance,
      };
    }

    return {
      template: instance,
      viewInstance: instance,
    };
  }

  private transformElementsRecursively(
    parent: DomElement | null,
    source: HtmlDefinition,
    bindings: (() => Disposable)[],
    context: TraversingContext,
    parentNamespace: string | undefined
  ): DomNode | null {
    if (typeof source.element === 'string') {
      /**
       * If element is string then this
       * HtmlDefinition represents an
       * actual DOM element, so we need to
       * create and initialize it.
       */

      const actualNamespace = source.namespace || parentNamespace;

      const result = actualNamespace
        ? this.domEngine.createNamespaceElement(actualNamespace, source.element)
        : this.domEngine.createElement(source.element);

      if (source.nested) {
        this.processElementNested(
          source,
          result,
          bindings,
          context,
          actualNamespace
        );
      }

      this.processElementAttributes(source, bindings, result, context);

      return result;
    }

    if (typeof source.element === 'function') {
      /**
       * If element is a function then this
       * HtmlDefenition represents a nested
       * view to be rendered.
       */
      return this.processViewComponent(
        source.element,
        source.attributes,
        bindings
      );
    }

    bindings.push(() =>
      this.troubleshooter.unknownHtmlDefinition(source, parent)
    );

    return null;
  }

  private processViewComponent(
    constructor: ViewComponentConstructor<unknown>,
    constructorArgument: unknown,
    bindings: (() => Disposable)[]
  ): DomNode | null {
    const component: ViewComponent<unknown> = new constructor(
      constructorArgument
    );

    if (!component.$$createBinding) {
      // todo report an issue
      return null;
    }

    const viewPlaceholderElement = this.domEngine.createMarkerElement(
      component.markerId
    );
    bindings.push(() =>
      component.$$createBinding(viewPlaceholderElement, this, this.domEngine)
    );

    return viewPlaceholderElement;
  }

  private processElementNested(
    source: HtmlDefinition,
    result: DomElement,
    bindings: (() => Disposable)[],
    context: TraversingContext,
    namespace: string | undefined
  ) {
    for (let i = 0; i < source.nested.length; i++) {
      const nested: NestedHtmlDefinition = source.nested[i];

      this.processElementNestedItem(
        nested,
        result,
        bindings,
        context,
        namespace
      );
    }
  }

  private processElementNestedItem(
    nested: NestedHtmlDefinition,
    result: DomElement,
    bindings: (() => Disposable)[],
    context: TraversingContext,
    namespace: string | undefined
  ) {
    if (nested === null || nested === undefined) {
      return;
    }

    if (typeof nested === 'string') {
      result.appendChild(this.domEngine.createTextNode(nested));
      return;
    }

    if (typeof nested === 'number' || typeof nested === 'boolean') {
      result.appendChild(this.domEngine.createTextNode(nested.toString()));
      return;
    }

    if ('element' in nested) {
      const newChild = this.transformElementsRecursively(
        result,
        nested,
        bindings,
        context,
        namespace
      );

      if (newChild !== null) {
        result.appendChild(newChild);
      }

      return;
    }

    if ('listen' in nested) {
      const connectorSource = nested as Listenable<PossiblyFormattable>;
      const connectorTarget = this.domEngine.createTextNode('');

      result.appendChild(connectorTarget);

      bindings.push(
        () => new ListenableTextConnector(connectorSource, connectorTarget)
      );

      return;
    }

    /**
     * All the unknown elements rendered as strings
     */
    result.appendChild(
      this.domEngine.createTextNode(
        nested.toString ? nested.toString() ?? '' : ''
      )
    );
  }

  private processElementAttributes(
    source: HtmlDefinition,
    bindings: (() => Disposable)[],
    result: DomElement,
    context: TraversingContext
  ) {
    for (const attributeName in source.attributes) {
      const attrPrefix =
        attributeName && attributeName.length > 0 ? attributeName[0] : null;
      const attributeValue = source.attributes[attributeName];

      if (attrPrefix === '$') {
        bindings.push(() =>
          this.configureBinding(result, attributeName, attributeValue)
        );
      } else if (attrPrefix === '_') {
        bindings.push(
          this.createEventInitializer(
            result,
            attributeName,
            attributeValue,
            context
          )
        );
      } else if (typeof attributeValue === 'string') {
        /**
         * We could avoid this "if" condition because ListenableAttributeConnector (see next step)
         * can handle both static and listenable, but we set string attributes here
         * directly because of two reasons:
         *  - performance
         *  - to avoid confusion with class attribute vs className binding.
         */
        result.setAttribute(attributeName, attributeValue);
      } else {
        bindings.push(
          () =>
            new ListenableAttributeConnector(
              attributeValue,
              result,
              attributeName
            )
        );
      }
    }
  }

  private configureBinding(
    element: DomElement,
    bindingCode: string,
    bindingArgs: unknown
  ): Disposable {
    const binding = this.bindingRegistry[bindingCode];

    if (!binding) {
      return this.troubleshooter.bindingNotFound(bindingCode, element);
    }

    return binding(element, bindingArgs);
  }

  private createEventInitializer(
    result: DomElement,
    attributeName: string,
    attributeValue: (...args: unknown[]) => unknown,
    context: TraversingContext
  ): () => Disposable {
    const { eventKey, eventThis } =
      attributeName.length > 1 && attributeName[1] === '_'
        ? { eventKey: attributeName.slice(2), eventThis: context.viewInstance }
        : { eventKey: attributeName.slice(1), eventThis: context.viewModel };

    return () => {
      const eventCallback = function (...args: unknown[]) {
          attributeValue.apply(eventThis, args);
        },
        handle = result.attachEventHandler(eventKey, eventCallback);

      return {
        dispose: () => result.detachEventHandler(eventKey, handle),
      };
    };
  }
}
