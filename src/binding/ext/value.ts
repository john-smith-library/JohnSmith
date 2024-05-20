/**
 * Extend the DefaultBindingRegistry prototype to support the $value binding.
 * This binding allows syncing the value of an input element with reactive data.
 *
 * See {@link view/jsx/default-intrinsic-element!DefaultIntrinsicElements#$value | $value} for details.
 *
 * @module
 */

import { DefaultBindingRegistry } from '../registry';
import { DomElement } from '../../view';
import { Listenable } from '../../reactive';
import { AbstractBidirectionalConnector } from '../../view/connectors/abstract';
import { BidirectionalListenable } from '../../reactive';

/**
 * Defines the type for bidirectional configuration, which is a tuple containing
 * a BidirectionalListenable<string> and a string event name.
 */
export type BidirectionalConfig = [BidirectionalListenable<string>, string];

/**
 * Defines the possible types for the value binding.
 * It can be a BidirectionalListenable<string>, a Listenable<string | null>, a string,
 * or a tuple containing a BidirectionalListenable<string | null> and a string event name.
 */
export type ValueType =
  | BidirectionalListenable<string>
  | Listenable<string | null>
  | string
  | [BidirectionalListenable<string | null>, string];

/**
 * Defines the connector value type, which can be a BidirectionalListenable<string>,
 * a Listenable<string>, or a string.
 */
type ConnectorValueType =
  | BidirectionalListenable<string>
  | Listenable<string>
  | string;

/**
 * Extend the DefaultBindingRegistry prototype to support the $value binding.
 * This binding allows syncing the value of an input element with reactive data.
 * @param element The DOM element to which the value will be applied.
 * @param bindingArgs The binding arguments, which can be a string, a Listenable, a BidirectionalListenable, or a tuple with a BidirectionalListenable and an event name.
 * @returns An instance of AbstractBidirectionalConnector that manages the two-way binding of the input value.
 */
DefaultBindingRegistry.prototype['$value'] = (
  element: DomElement,
  bindingArgs: unknown
) => {
  const typedBindingArgs = bindingArgs as ValueType;

  // Determine the event type and source based on the binding arguments.
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

/*
 * Extend the DefaultIntrinsicElements interface to include the $value member.
 */
declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    /**
     * Represents a binding for managing the value of an input element.
     * Accepts a string, a Listenable<string | null>, a BidirectionalListenable<string>,
     * or a tuple with a BidirectionalListenable<string | null> and an event name.
     *
     * @example
     * // Assuming `viewModel.inputValue` is a string or `Listenable<string>`:
     * <input type="text" $value={viewModel.inputValue} />
     *
     * @example
     * // Assuming `viewModel.inputValue` is a `BidirectionalListenable<string>` and 'input' is the event name:
     * <input type="text" $value={[viewModel.inputValue, 'input']} />
     */
    $value?: ValueType;
  }
}
