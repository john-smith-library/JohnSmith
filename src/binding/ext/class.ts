import {DefaultBindingRegistry} from '../registry';
import {DomElement} from '../../dom';
import {Listenable} from '../../reactive';

DefaultBindingRegistry.prototype['$class'] = (element: DomElement, bindingArgs: any) => {
    if (bindingArgs && bindingArgs.listen) {
        const listenable = <Listenable<any>>bindingArgs;

        return listenable.listen(value => element.setAttribute('class',value === null ? '' : value.toString()));
    }

    return { dispose: () => {} }; // todo
};

declare module '../../default-intristic-element' {
    interface DefaultIntrinsicElements {
        $class?: Listenable<string|null>|string
    }
}