import { DefaultBindingRegistry } from '../registry';
import { DomElement } from '../../view';
import { Disposable, NoopDisposable, ToDisposable } from '../../common';

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

declare module '../../view/jsx/default-intrinsic-element' {
  interface DefaultIntrinsicElements {
    $bind?: (domElement: DomElement) => void | Disposable | Disposable[];
  }
}
