/**
 * Extends the `DefaultBindingRegistry` prototype to support the `$bind` binding.
 * This binding allows executing a custom binding function that can manage its own cleanup.
 *
 * See {@link view/jsx/default-intrinsic-element!DefaultIntrinsicElements#$bind | $bind} for details.
 *
 * @module
 */

import { DefaultBindingRegistry } from '../registry';
import { DomElement } from '../../view';
import { Disposable, NoopDisposable, ToDisposable } from '../../common';

/**
 * Extend the `DefaultBindingRegistry` prototype to support the `$bind` binding.
 * This binding allows executing a custom binding function that can manage its own cleanup.
 * @param element The DOM element to which the binding function will be applied.
 * @param bindingArgs The binding arguments, which should be a function that takes a `DomElement` and returns a `Disposable` or `undefined`.
 * @returns A Disposable that handles the cleanup of the binding.
 */
DefaultBindingRegistry.prototype['$bind'] = (
  element: DomElement,
  bindingArgs: unknown
) => {
  const bindCallback = bindingArgs as (
      root: DomElement
    ) => Disposable | undefined,
    bindResult = ToDisposable(bindCallback(element));

  if (bindResult) {
    return bindResult;
  }

  return NoopDisposable;
};

/*
 * Extend the DefaultIntrinsicElements interface to include the $bind member.
 */
declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    /**
     * Represents a binding for executing a custom binding function on a DOM element.
     * The function can return a Disposable or an array of Disposables for cleanup.
     *
     * @example
     * // Assuming `customBindFunction` is a function defined within the View that takes a DomElement and returns a Disposable:
     * const customBindFunction = (element: DomElement): Disposable => {
     *   // Custom binding logic
     *   return {
     *     dispose: () => {
     *       // Cleanup logic
     *     }
     *   };
     * };
     *
     * <div $bind={customBindFunction} />
     */
    $bind?: (domElement: DomElement) => void | Disposable | Disposable[];
  }
}
