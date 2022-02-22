import {DefaultBindingRegistry} from '../registry';
import {DomElement} from '../../view';
import {Listenable} from '../../reactive';
import {AbstractListenableConnector} from '../../view/connectors/abstract';

DefaultBindingRegistry.prototype['$className'] = (element: DomElement, bindingArgs: unknown) => {
    const classNames = element.createClassNames();

    return new AbstractListenableConnector<any>(
        bindingArgs,
        (value: any) => {
            if (value === null) {
                return null;
            }

            classNames.add(value);

            return {
                dispose: () => {
                    classNames.remove(value);
                }
            };
        });
};

declare module '../../view/jsx/default-intrinsic-element' {
    interface DefaultIntrinsicElements {
        $className?: Listenable<string|null>|string
    }
}