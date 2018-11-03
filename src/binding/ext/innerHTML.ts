import {DefaultBindingRegistry} from "../registry";
import {DefaultIntrinsicElements} from "../../view/jsx/default-intristic-element";
import {Listenable} from "../../reactive";
import {DomElement} from "../../view/element";
import {AbstractListenableConnector} from '../../view/connectors/abstract';

DefaultBindingRegistry.prototype['$innerHTML'] = (element: DomElement, bindingArgs: any) => {
    return new AbstractListenableConnector(bindingArgs, (value: any) => {
        if (value === null) {
            element.setInnerHtml('');
        } else {
            element.setInnerHtml(value);
        }

        return { dispose: () => {} }; // todo
    });

    // if (bindingArgs && bindingArgs.listen) {
    //     const listenable = <Listenable<any>>bindingArgs;
    //
    //     return listenable.listen(value => element.setInnerText(value === null ? '' : value.toString()));
    // }
    //
    // return { dispose: () => {} }; // todo
};

declare module '../../view/jsx/default-intristic-element' {
    interface DefaultIntrinsicElements {
        $innerHTML?: Listenable<string|null>|string
    }
}