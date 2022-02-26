import {DefaultBindingRegistry} from "../registry";
import {Listenable} from "../../reactive";
import {DomElement} from "../../view";
import {AbstractListenableConnector} from '../../view/connectors/abstract';

type InnerHtmlValue = Listenable<string|null>|string|null|undefined;

DefaultBindingRegistry.prototype['$innerHTML'] = (element: DomElement, bindingArgs: unknown) => {
    return new AbstractListenableConnector<string>(
        <InnerHtmlValue>bindingArgs,
        (value: string|null) => {
            element.setInnerHtml(value === null ? '' : value);

            return null;
        });
};

declare module '../../view/jsx/default-intrinsic-element' {
    interface DefaultIntrinsicElements {
        $innerHTML?: InnerHtmlValue
    }
}
