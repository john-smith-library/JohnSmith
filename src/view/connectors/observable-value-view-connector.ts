import { Listenable } from '../../reactive';
import { ViewDefinition } from '../view-definition';
import { ViewRenderer } from '../view-renderer';
import { DomElement } from '../element';
import { AbstractListenableConnector } from './abstract';

/**
 * Connects a Value to a DOM HTML Element via rendering a View.
 * If the Value is listenable then the View will be re-rendered
 * on every Value change.
 *
 * If the Value is null or undefined the corresponding DOM Element
 * will be cleared.
 */
export class ObservableValueViewConnector<T> extends AbstractListenableConnector<T> {
    constructor(
        source: Listenable<T|null>|T|null|undefined,
        target: DomElement,
        view: ViewDefinition<T>,
        _viewRenderer: ViewRenderer) {

        super(source, (value: T|null|undefined) => {
            if (value !== null && value !== undefined)
            {
                return _viewRenderer.render(target, view, value);
            }

            return null;
        });
    }
}
