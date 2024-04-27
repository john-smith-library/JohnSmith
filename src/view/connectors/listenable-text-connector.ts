import { AbstractListenableConnector } from './abstract';
import { Listenable } from '../../reactive';
import { DomText } from '../element';

export type PossiblyFormattable = {
  toString?: () => string;
};

/**
 * Connects a Value to a DOM HTML Element via setting the Element text.
 * If the Value is listenable then the text will be updated
 * on every Value change.
 *
 * If the Value is null or undefined the corresponding DOM Element
 * will be cleared.
 */
export class ListenableTextConnector<
  T extends PossiblyFormattable,
> extends AbstractListenableConnector<T> {
  constructor(
    source: Listenable<T | null> | T | null | undefined,
    domText: DomText
  ) {
    super(source, (value: T | null | undefined) => {
      domText.setText(
        value === null || value === undefined
          ? ''
          : value.toString
            ? value.toString()
            : 'unknown'
      );

      /**
       * No need to dispose text node, so return null
       */

      return null;
    });
  }
}
