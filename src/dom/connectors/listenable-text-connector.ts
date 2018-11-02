import {AbstractListenableConnector} from './abstract';
import {Listenable} from '../../reactive';
import {DomText} from '../element';

export class ListenableTextConnector<T> extends AbstractListenableConnector<T> {
    constructor(source: Listenable<T> | T, domText:DomText) {
        super(source, (value: T|null) => {
            domText.setText(value === null ? '' : value.toString());

            /**
             * No need to dispose text node, so return null
             */

            return null;
        });
    }
}