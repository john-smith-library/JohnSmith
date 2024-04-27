import { AbstractListenableConnector } from './abstract';
import { Listenable } from '../../reactive';
import { DomElement } from '../element';

/**
 * Connects a Value to an Attribute of a DOM HTML Element.
 */
export class ListenableAttributeConnector<
  T,
> extends AbstractListenableConnector<T> {
  constructor(
    source: Listenable<T | null> | null | undefined,
    target: DomElement,
    attributeName: string
  ) {
    super(source, (value: T | null | undefined) => {
      if (value === undefined) {
        target.removeAttribute(attributeName);
      } else if (value === null) {
        target.setAttribute(attributeName, '');
      } else {
        target.setAttribute(attributeName, value);
      }

      /**
       * We do not need to dispose anything in case
       * of attribute rendering so just return null.
       */
      return null;
    });
  }
}
