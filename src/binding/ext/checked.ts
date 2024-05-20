/**
 * Extends the `DefaultBindingRegistry` prototype to support the `$checked` binding.
 * This binding allows syncing the checked state of a checkbox or similar input element with reactive data.
 *
 * See {@link view/jsx/default-intrinsic-element!DefaultIntrinsicElements#$checked | $checked} for details.
 *
 * @module
 */

import { DefaultBindingRegistry } from '../registry';
import { DomElement } from '../../view';
import { Listenable } from '../../reactive';
import { AbstractBidirectionalConnector } from '../../view/connectors/abstract';
import { BidirectionalListenable } from '../../reactive';

export type CheckedValue =
  | BidirectionalListenable<boolean | null>
  | Listenable<boolean | null>
  | boolean
  | null;

/**
 * Extend the `DefaultBindingRegistry` prototype to support the `$checked` binding.
 * This binding allows syncing the checked state of a checkbox or similar input element with reactive data.
 * @param element The DOM element to which the checked state will be applied.
 * @param bindingArgs The binding arguments, which can be a boolean, a `Listenable`, or a `BidirectionalListenable` of boolean or null.
 * @returns An instance of `AbstractBidirectionalConnector` that manages the two-way binding of the checked state.
 */
DefaultBindingRegistry.prototype['$checked'] = (
  element: DomElement,
  bindingArgs: unknown
) => {
  return new AbstractBidirectionalConnector(
    bindingArgs as CheckedValue,
    element,
    (elem: DomElement) => elem.isChecked(),
    (elem: DomElement, value: boolean | null) => elem.setChecked(!!value),
    'change'
  );
};

declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    /**
     * Represents a binding for managing the checked state of a checkbox or similar input element.
     * Accepts a boolean, a Listenable, or a BidirectionalListenable of boolean or null.
     *
     * @example
     * // Assuming `viewModel.isChecked` is a boolean or `Listenable<boolean>`:
     * <input type="checkbox" $checked={viewModel.isChecked} />
     */
    $checked?: CheckedValue;
  }
}
