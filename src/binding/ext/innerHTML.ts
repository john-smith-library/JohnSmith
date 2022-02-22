import {DefaultBindingRegistry} from "../registry";
import {Listenable} from "../../reactive";
import {DomElement} from "../../view";
import {AbstractListenableConnector} from '../../view/connectors/abstract';

DefaultBindingRegistry.prototype['$innerHTML'] = (element: DomElement, bindingArgs: any) => {
    return new AbstractListenableConnector(bindingArgs, (value: any) => {
        element.setInnerHtml(value === null ? '' : value);

        return null;
    });
};

declare module '../../view/jsx/default-intrinsic-element' {
    interface DefaultIntrinsicElements {
        $innerHTML?: Listenable<string|null>|string
    }
}