import { DefaultBindingRegistry } from '../registry';
import { DomElement } from '../../view';
import { Listenable } from '../../reactive';
import { AbstractBidirectionalConnector } from '../../view/connectors/abstract';
import { BidirectionalListenable } from '../../reactive';

export type BidirectionalConfig = [BidirectionalListenable<string>, string];

export type ValueType =
  | BidirectionalListenable<string>
  | Listenable<string | null>
  | string
  | [BidirectionalListenable<string | null>, string];

type ConnectorValueType =
  | BidirectionalListenable<string>
  | Listenable<string>
  | string;

DefaultBindingRegistry.prototype['$value'] = (
  element: DomElement,
  bindingArgs: unknown
) => {
  const typedBindingArgs = bindingArgs as ValueType;

  const { event, source }: { event: string; source: ConnectorValueType } =
    typedBindingArgs && (typedBindingArgs as BidirectionalConfig).length === 2
      ? {
          event: (typedBindingArgs as BidirectionalConfig)[1],
          source: (typedBindingArgs as BidirectionalConfig)[0],
        }
      : {
          event: 'change',
          source: typedBindingArgs as ConnectorValueType,
        };

  return new AbstractBidirectionalConnector<string>(
    source,
    element,
    (elem: DomElement) => elem.getValue(),
    (elem: DomElement, value: string | null) =>
      elem.setValue(value === null ? '' : value),
    event
  );
};

declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    $value?: ValueType;
  }
}
