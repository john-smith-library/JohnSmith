import {AbstractListenableConnector} from './abstract';
import {Listenable} from '../../reactive';
import {DomElement} from '../element';

export class ListenableAttributeConnector<T> extends AbstractListenableConnector<T> {
    constructor(
        source: Listenable<T>,
        target: DomElement,
        attributeName: string) {

        super(source, (value: any) => {
            if (value === null) {
                target.removeAttribute(attributeName);
            } else {
                target.setAttribute(attributeName, value)
            }

            /**
             * We do not need to dispose anything in case
             * of attribute rendering so just return null.
             */
            return null;
        });
    }
}