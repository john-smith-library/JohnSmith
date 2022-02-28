import {AbstractListenableConnector} from './abstract';
import {Listenable} from '../../reactive';
import {DomText} from '../element';

type PossiblyFormattable = {
    toString?: () => string;
}

export class ListenableTextConnector<T extends PossiblyFormattable> extends AbstractListenableConnector<T> {
    constructor(source: Listenable<T> | T, domText:DomText) {
        super(source, (value: T|null) => {
            domText.setText(value === null ? '' : (value.toString ? value.toString() : 'unknown'));

            /**
             * No need to dispose text node, so return null
             */

            return null;
        });
    }
}
