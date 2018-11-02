import {DefaultBindingRegistry} from '../registry';
import {DomElement} from '../../dom';
import {Listenable} from '../../reactive';
import {AbstractListenableConnector} from '../../dom/connectors/abstract';

DefaultBindingRegistry.prototype['$className'] = (element: DomElement, bindingArgs: any) => {
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

declare module '../../default-intristic-element' {
    interface DefaultIntrinsicElements {
        $className?: Listenable<string|null>|string
    }
}