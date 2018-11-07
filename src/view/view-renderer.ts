import { DomElement } from './element';
import {Disposable, NoopDisposable, Owner} from '../common';
import {HtmlDefinition, ViewDefinition} from './view-definition';
import {DomEngine} from "./dom-engine";
import {BindingRegistry} from "../binding/registry";
import {Listenable} from '../reactive';
import {ObservableListViewConnector, ObservableValueViewConnector, ListenableAttributeConnector, ListenableTextConnector} from './connectors';

import '../binding/default';

export interface ViewRenderer {
    /**
     * Renders a view into a DOM element and returns rendered disposable instance.
     *
     * @param element - the DOM element to render to
     * @param view - the view definition to render
     * @param viewModel - the view model instance
     */
    render<ViewModel>(element: DomElement, view: ViewDefinition<ViewModel>, viewModel: ViewModel): Disposable;
}

type ViewRuntimeData = { template: HtmlDefinition, viewInstance?: any /* todo: typings */ };
type Initializers = (() => Disposable)[];
type TraversingContext = { viewInstance: any, viewModel: any };

export class DefaultViewRenderer implements ViewRenderer {
    constructor(
        private domEngine: DomEngine,
        private bindingRegistry: BindingRegistry){
    }

    /**
     * @inheritDoc
     * @param element @inheritDoc
     * @param view @inheritDoc
     * @param viewModel @inheritDoc
     */
    render<ViewModel>(
        element: DomElement,
        view: ViewDefinition<ViewModel>,
        viewModel: ViewModel): Disposable {

        const
            viewRuntime = DefaultViewRenderer.createViewRuntime(view, viewModel),
            template = viewRuntime.template;

        const
            initializers: Initializers = [],
            context: TraversingContext = {
                viewInstance: viewRuntime.viewInstance,
                viewModel: viewModel
            },
            transformedTemplate = this.transformElementsRecursively(element, template, initializers, context);

        const result = new Owner();

        if (transformedTemplate !== null)
        {
            // todo: init view model
            // todo: dispose view model (as a first step?)
            element.appendChild(transformedTemplate);
            result.own({
                dispose: () => {
                    transformedTemplate.remove();
                }
            });
        }

        for (let i = initializers.length - 1; i >= 0 ; i--) {
            result.own(initializers[i]());
        }

        return result;
    }

    private static createViewRuntime<ViewModel> (
        viewDefinition: ViewDefinition<ViewModel>,
        viewModel:ViewModel) : ViewRuntimeData {
        const
            viewDefinitionUntyped = <any>viewDefinition,
            instance = new viewDefinitionUntyped(viewModel);

        if (instance.template) {
            return {
                template: instance.template(viewModel),
                viewInstance: instance
            };
        }

        return {
            template: instance
        }
    }

    private transformElementsRecursively(
        parent: DomElement,
        source: HtmlDefinition,
        bindings: (() => Disposable)[],
        context: TraversingContext): DomElement | null {

        if (typeof source.element === 'string') {
            /**
             * If element is string then this
             * HtmlDefenition represents an
             * actual DOM element so we need to
             * create and initialize it.
             */

            let result = this.domEngine.createElement(source.element);

            if (source.nested) {
                this.processElementNested(source, result, bindings, context);
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
            this.processView(source, bindings, parent);

            /**
             * Return null here as view definition
             * does not actually represent any dom
             * element.
             */
            return null;
        }

        return null; // todo: unknown HtmlDefinition
    }

    private processView(source: HtmlDefinition, bindings: (() => Disposable)[], parent: DomElement) {
        if (!source.attributes) {
            return;
        }

        const viewDefinition = source.element;

        const viewModel: any|null = source.attributes.viewModel;
        if (viewModel) {
            bindings.push(() => new ObservableValueViewConnector(viewModel, parent, viewDefinition, this));
        } else {
            const listViewModel: any|null = source.attributes.listViewModel;
            if (listViewModel) {
                bindings.push(() => new ObservableListViewConnector(listViewModel, parent, viewDefinition, this));
            }
        }
    }

    private processElementNested(
        source: HtmlDefinition,
        result: DomElement,
        bindings: (() => Disposable)[],
        context: TraversingContext) {

        for (let i = 0; i < source.nested.length; i++) {
            const nested = source.nested[i];

            if (nested.element) {
                let newChild = this.transformElementsRecursively(result, nested, bindings, context);
                if (newChild !== null) {
                    result.appendChild(newChild);
                }
            } else if (typeof nested === 'string') {
                result.appendText(this.domEngine.createTextNode(nested));
            } else if (nested.listen) {
                const
                    connectorSource = <Listenable<any>>nested,
                    connectorTarget = this.domEngine.createTextNode(nested);

                result.appendText(connectorTarget);

                bindings.push(() => new ListenableTextConnector(connectorSource, connectorTarget));
            } else {
                /**
                 * All the unknown elements rendered as strings
                 */
                result.appendText(this.domEngine.createTextNode(nested.toString()));
            }
        }
    }

    private processElementAttributes(
        source: HtmlDefinition,
        bindings: (() => Disposable)[],
        result: DomElement,
        context: TraversingContext) {

        for (const attributeName in source.attributes) {
            const attrPrefix = attributeName && attributeName.length > 0 ? attributeName[0] : null;
            const attributeValue = source.attributes[attributeName];

            if (attributeName === '$bind') {
                if (attributeValue) {
                    bindings.push(() => {
                        const
                            bindCallback = <Function>attributeValue,
                            bindResult = bindCallback.call(context.viewInstance, result, context.viewModel);

                        if (bindResult) {
                            if (bindResult.dispose) {
                                return bindResult;
                            }

                            if (bindResult.length) {
                                return new Owner(bindResult);
                            }
                        }

                        return NoopDisposable;
                    });
                }
            } else if (attrPrefix === '$') {
                bindings.push(() => this.configureBinding(result, attributeName, attributeValue));
            } else if (attrPrefix === '_') {
                bindings.push(this.createEventInitializer(result, attributeName, attributeValue, context))

            } else {
                if (typeof attributeValue === 'string') {
                    /**
                     * We could avoid this "if" condition because ListenableAttributeConnector
                     * can handle both static and listenable, but we set string attributes here
                     * directly because of two reasons:
                     *  - performance
                     *  - to avoid confusion with class atribute vs className binding.
                     */
                    result.setAttribute(attributeName, attributeValue);
                } else  {
                    bindings.push(() => new ListenableAttributeConnector(attributeValue, result, attributeName));
                }
            }
        }
    }

    private configureBinding(element: DomElement, bindingCode: string, bindingArgs: any) {
        // todo handle unknown binding issues
        return this.bindingRegistry[bindingCode](element, bindingArgs);
    }

    private createEventInitializer(result: DomElement, attributeName: string, attributeValue: any, context: TraversingContext): () => Disposable {
        const { eventKey, eventThis } =
            attributeName.length > 1 && attributeName[1] === '_' ?
                { eventKey: attributeName.substr(2), eventThis: context.viewInstance } :
                { eventKey: attributeName.substr(1), eventThis: context.viewModel };

        return () => {
            const rawCallback = <Function>attributeValue,
                eventCallback = function() {
                    rawCallback.apply(eventThis, arguments);
                },
                handle = result.attachEventHandler(eventKey, eventCallback);

            return {
                dispose: () => result.detachEventHandler(eventKey, handle)
            };
        };
    }
}