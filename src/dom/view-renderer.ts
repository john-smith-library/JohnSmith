import { DomElement } from './element';
import {Disposable, Owner} from '../common';
import {HtmlDefinition, View, ViewConstructor, ViewDefinition} from './view';
import {DomEngine} from "./dom-engine";
import {BindingRegistry} from "../binding/registry";
import {Listenable, ObservableList} from '../reactive';
import {ObservableListViewConnector, ObservableValueViewConnector} from './connectors';

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

export class DefaultViewRenderer implements ViewRenderer {
    constructor(
        private domEngine: DomEngine,
        private bindingRegistry: BindingRegistry){
    }

    render<ViewModel>(
        element: DomElement,
        view: ViewDefinition<ViewModel>,
        viewModel: ViewModel): Disposable {

        const
            viewInstance = this.createViewInstance<ViewModel>(view),
            template = viewInstance.template(viewModel);

        const
            initializers: (() => Disposable)[] = [],
            transformedTemplate = this.transformElementsRecursively(element, template, initializers);

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

    private isViewConstructor<ViewModel>(
        viewDefinition: ViewDefinition<ViewModel>): viewDefinition is ViewConstructor<ViewModel> {

        return !!viewDefinition.prototype.template;
    }

    private createViewInstance<ViewModel>(
        viewDefinition: ViewDefinition<ViewModel>) : View<ViewModel> {

        if (this.isViewConstructor(viewDefinition)) {
            return new viewDefinition();
        }

        return {
            template: viewDefinition
        };
    }

    private transformElementsRecursively(
        parent: DomElement,
        source: HtmlDefinition,
        bindings: (() => Disposable)[]): DomElement | null {

        if (typeof source.element === 'string') {
            /**
             * If element is string then this
             * HtmlDefenition represents an
             * actual DOM element so we need to
             * create and initialize it.
             */

            let result = this.domEngine.createElement(source.element);

            if (source.nested) {
                this.processElementNested(source, result, bindings);
            }

            this.processElementAttributes(source, bindings, result);

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
        const viewModel: any = source.nested && source.nested.length > 0 ? source.nested[0] : null;

        if (viewModel.listen) {
            const
                viewModelListenable = <Listenable<any>>viewModel,
                viewDefinition = source.element;

            if (viewModelListenable instanceof ObservableList) {
                bindings.push(() => new ObservableListViewConnector(
                    viewModelListenable, parent, viewDefinition, this));
            } else {
                bindings.push(() => new ObservableValueViewConnector(
                    viewModelListenable, parent, viewDefinition, this));
            }
        } else {
            /**
             * Render single view
             */
            bindings.push(() => this.render(
                parent,
                source.element,
                viewModel));
        }
    }

    private processElementNested(source: HtmlDefinition, result: DomElement, bindings: (() => Disposable)[]) {
        for (let i = 0; i < source.nested.length; i++) {
            const nested = source.nested[i];

            if (nested.element) {
                let newChild = this.transformElementsRecursively(result, nested, bindings);
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

                bindings.push(() => {
                    return connectorSource.listen(v => connectorTarget.setText(v == null ? '' : v.toString()));
                    // todo: dispose connector target
                });
                // todo: handle default binding
            } else {
                /**
                 * All the unknown elements rendered as strings
                 */
                result.appendText(this.domEngine.createTextNode(nested.toString()));
            }
        }
    }

    private processElementAttributes(source: HtmlDefinition, bindings: (() => Disposable)[], result: DomElement) {
        for (const attributeKey in source.attributes) {
            const attrPrefix = attributeKey && attributeKey.length > 0 ? attributeKey[0] : null;
            const attributeValue = source.attributes[attributeKey];

            if (attrPrefix === '$') {
                bindings.push(() => this.configureBinding(result, attributeKey, attributeValue));
            } else if (attrPrefix === '_') {
                // todo: events
                const eventKey = attributeKey.substr(1);
                bindings.push(() => {
                    const handle = result.attachEventHandler(eventKey, attributeValue);

                    return {
                        dispose: () => result.detachEventHandler(eventKey, handle)
                    };
                });
            } else {
                result.setAttribute(attributeKey, attributeValue);
            }
        }
    }

    private configureBinding(element: DomElement, bindingCode: string, bindingArgs: any) {
        // todo handle unknown binding issues
        return this.bindingRegistry[bindingCode](element, bindingArgs);
    }
}