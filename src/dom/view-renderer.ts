import { DomElement } from './element';
import {Disposable, Owner} from '../common';
import { HtmlDefinition, View } from './view';
import {DomEngine} from "./dom-engine";
import {BindingRegistry} from "../binding/registry";
import {Listenable} from "../reactive";

export interface ViewRenderer {
    render<ViewModel>(element: DomElement, view: { new(): View<ViewModel> }, viewModel: ViewModel): Disposable;
}

export class DefaultViewRenderer implements ViewRenderer {
    constructor(
        private domEngine: DomEngine,
        private bindingRegistry: BindingRegistry){
    }

    render<ViewModel>(
        element: DomElement,
        view: { new(): View<ViewModel> },
        viewModel: ViewModel): Disposable {

        const viewInstance = new view();

        const
            template = viewInstance.template(viewModel),
            initializers: (() => Disposable)[] = [],
            transformedTemplate = this.transformElementsRecursively(element, template, initializers);

        if (transformedTemplate !== null)
        {
            element.setInnerElement(transformedTemplate);
        }

        const result = new Owner();

        for (let i = 0; i < initializers.length; i++) {
            result.own(initializers[i]());
        }

        // todo: handle bindings

        // todo: remove element

        return result;
    }

    private transformElementsRecursively(
        parent: DomElement,
        source: HtmlDefinition,
        bindings: (() => Disposable)[]): DomElement | null {
        if (typeof source.element === 'string') {
            let result = this.domEngine.createElement(source.element);

            if (source.nested) {
                for (let i = 0; i < source.nested.length; i++) {
                    const nested = source.nested[i];

                    if (nested.element) {
                        let newChild = this.transformElementsRecursively(result, nested, bindings);
                        if (newChild !== null)
                        {
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
                    }
                }
            }

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

            return result;
        }

        if (typeof source.element === 'function') {
            const viewModel: any = source.nested && source.nested.length > 0 ? source.nested[0] : null;

            if (viewModel.listen) {
                const viewModelListenable = <Listenable<any>>viewModel;

                /**
                 * Render view with binding
                 */
                bindings.push(() => { // todo: extract to some abstractions
                    let currentView: Disposable|null = null;
                    return viewModelListenable.listen(v => {
                        if (currentView !== null) {
                            currentView.dispose();
                        }

                        if (v) {
                            this.render(parent, source.element, v);
                        }
                    })
                });
            } else {
                /**
                 * Render single view
                 */
                bindings.push(() => this.render(
                    parent,
                    source.element,
                    viewModel));
            }

            // todo
            //bindings.push(() => this.render())
        }

        return null; // todo: unknown HtmlDefinition
    }

    private configureBinding(element: DomElement, bindingCode: string, bindingArgs: any) {
        // todo handle unknown binding issues
        return this.bindingRegistry[bindingCode](element, bindingArgs);
    }
}