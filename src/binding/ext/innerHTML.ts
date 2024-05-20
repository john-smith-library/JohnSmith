/**
 * Extends the `DefaultBindingRegistry` prototype to support the `$innerHTML` binding.
 * This binding allows setting the inner HTML content of a DOM element based on reactive data.
 * Note: Setting innerHTML directly can be dangerous and can lead to XSS (Cross-Site Scripting) attacks.
 * Ensure the input is sanitized and safe before using this binding.
 *
 * See {@link view/jsx/default-intrinsic-element!DefaultIntrinsicElements#$innerHTML | $innerHTML} for details.
 *
 * @module
 */

import { DefaultBindingRegistry } from '../registry';
import { Listenable } from '../../reactive';
import { DomElement } from '../../view';
import { AbstractListenableConnector } from '../../view/connectors/abstract';

/**
 * Defines the possible types for the innerHTML binding value.
 * It can be a Listenable<string | null>, a string, null, or undefined.
 */
export type InnerHtmlValue =
  | Listenable<string | null>
  | string
  | null
  | undefined;

/**
 * Extend the `DefaultBindingRegistry` prototype to support the `$innerHTML` binding.
 * This binding allows setting the inner HTML content of a DOM element based on reactive data.
 * Note: Setting innerHTML directly can be dangerous and can lead to XSS (Cross-Site Scripting) attacks.
 * Ensure the input is sanitized and safe before using this binding.
 * @param element The DOM element to which the inner HTML will be applied.
 * @param bindingArgs The binding arguments, which can be a string, a Listenable, null, or undefined.
 * @returns An instance of AbstractListenableConnector that manages the binding of inner HTML content.
 */
DefaultBindingRegistry.prototype['$innerHTML'] = (
  element: DomElement,
  bindingArgs: unknown
) => {
  return new AbstractListenableConnector<string>(
    bindingArgs as InnerHtmlValue,
    (value: string | null) => {
      element.setInnerHtml(value === null ? '' : value);

      return null;
    }
  );
};

/*
 * Extend the DefaultIntrinsicElements interface to include the $innerHTML member.
 */
declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    /**
     * Represents a binding for managing the inner HTML content of a DOM element.
     * Accepts a string, a Listenable<string | null>, null, or undefined.
     *
     * @example
     * // Assuming `viewModel.htmlContent` is a string or `Listenable<string>`:
     * <div $innerHTML={viewModel.htmlContent} />
     *
     * @warning
     * Setting innerHTML directly can be dangerous and may lead to XSS (Cross-Site Scripting) attacks.
     * Ensure the input is sanitized and safe before using this binding.
     */
    $innerHTML?: InnerHtmlValue;
  }
}
