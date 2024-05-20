/**
 * Extends the `DefaultBindingRegistry` prototype to support the `$className` binding.
 * This binding allows adding or removing CSS class names based on reactive data.
 *
 * See {@link view/jsx/default-intrinsic-element!DefaultIntrinsicElements#$className | $className} for details.
 *
 * @module
 */

import { DefaultBindingRegistry } from '../registry';
import { DomElement } from '../../view';
import { isListenable, Listenable } from '../../reactive';
import { AbstractListenableConnector } from '../../view/connectors/abstract';
import { Owner } from '../../common';

/**
 * Extend the `DefaultBindingRegistry` prototype to support the `$className` binding.
 * This binding allows adding or removing CSS class names based on reactive data.
 * @param element The DOM element to which the CSS class name(s) will be applied.
 * @param bindingArgs The binding arguments, which can be either a string, a Listenable, or a Record of Listenable<boolean>.
 * @returns A Listenable connector that manages the binding of CSS class names.
 */
DefaultBindingRegistry.prototype['$className'] = (
  element: DomElement,
  bindingArgs: unknown
) => {
  // Create a set to manage CSS class names for the element
  const classNames = element.createClassNames();

  // Check if bindingArgs is a string or a Listenable
  if (typeof bindingArgs === 'string' || isListenable(bindingArgs)) {
    return new AbstractListenableConnector<string>(
      bindingArgs as Listenable<string | null>,
      (value: string | null) => {
        if (value === null) {
          return null;
        }

        classNames.add(value);

        return {
          dispose: () => {
            classNames.remove(value);
          },
        };
      }
    );
  }

  // If bindingArgs is not a string or a Listenable, assume it's a Record of Listenable<boolean>
  const result = new Owner();
  const classNameRecord = bindingArgs as Record<string, Listenable<boolean>>;

  for (const className in classNameRecord) {
    result.own(
      new AbstractListenableConnector<boolean>(
        classNameRecord[className] as Listenable<boolean>,
        (classShouldBeApplied: boolean | null) => {
          if (classShouldBeApplied) {
            classNames.add(className);
          } else {
            classNames.remove(className);
          }

          return null;
        }
      )
    );
  }

  return result;
};

/*
 * Extends the DefaultIntrinsicElements interface to include the $className member.
 */
declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    /**
     * Represents a binding for managing CSS class names of a DOM element.
     * Accepts a string, a Listenable, or a Record of Listenable<boolean> as binding arguments.
     *
     * @example
     * // Assuming `viewModel.status` is a string or `Listenable<string>`:
     * <span $className={viewModel.status} />
     *
     * @example
     * // Assuming `viewModel.active` and `viewModel.error` are of type `Listenable<boolean>` we can
     * // manage multiple classes:
     * <span $className={{ 'active': viewModel.active, 'error': viewModel.error }} />
     */
    $className?:
      | Listenable<string | null>
      | string
      | Record<string, Listenable<boolean>>;
  }
}
