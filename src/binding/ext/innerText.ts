import {DefaultBindingRegistry} from "../registry";
import {DefaultIntrinsicElements} from "../../default-intristic-element";
import {Listenable} from "../../reactive";
import {DomElement} from "../../dom/element";

DefaultBindingRegistry.prototype['$innerText'] = (element: DomElement, bindingArgs: any) => {
    if (bindingArgs && bindingArgs.listen) {
        const listenable = <Listenable<any>>bindingArgs;

        return listenable.listen(value => element.setInnerText(value === null ? '' : value.toString()));
    }

    return { dispose: () => {} }; // todo
};

declare module '../../default-intristic-element' {
    interface DefaultIntrinsicElements {
        $innerText?: Listenable<string>|string
    }
}