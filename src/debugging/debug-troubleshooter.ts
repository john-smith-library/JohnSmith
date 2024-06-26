import { Troubleshooter } from '../troubleshooting/troubleshooter';
import { DomElement, DomElementClasses, HtmlDefinition } from '../view';
import { Disposable } from '../common';
import { ErrorsViewModel } from './errors-view-model';

export class ErrorInfo {
  private _classNames: DomElementClasses;

  constructor(
    public readonly element: DomElement,
    public readonly message: string,
    public readonly index: number
  ) {
    this._classNames = this.element.createClassNames();
  }

  public highlightErrorElement() {
    this._classNames.add('js-debugger-error');
  }

  public unHighlightErrorElement() {
    this._classNames.remove('js-debugger-error');
  }
}

export class DebugTroubleshooter implements Troubleshooter {
  private _firstError = true;
  private _errorIndex = 1;

  constructor(
    private rootContext: DomElement,
    private debuggerViewModel: ErrorsViewModel,
    private onFirstErrorCallback: () => void
  ) {}

  public bindingNotFound(code: string, context: DomElement): Disposable {
    return this.pushErrorMessage(
      'Binding with code [' +
        code +
        '] is not registered, please make sure the code is correct and the binding definition has been imported',
      context
    );
  }

  public elementNotFound(
    element: HTMLElement | string,
    context: DomElement | null
  ): Disposable {
    return this.pushErrorMessage(
      'Required DOM element [' + element + '] was not found',
      context || this.rootContext
    );
  }

  public unknownHtmlDefinition(
    source: HtmlDefinition,
    context: DomElement
  ): Disposable {
    return this.pushErrorMessage(
      'Unsupported HTML Definition detected: [' + source.element + ']',
      context || this.rootContext
    );
  }

  private pushErrorMessage(message: string, target: DomElement): Disposable {
    if (this._firstError) {
      this.onFirstErrorCallback();
      this._firstError = false;
    }

    const errors = this.debuggerViewModel.errors;
    const error = new ErrorInfo(target, message, this._errorIndex++);

    errors.add(error);
    while (errors.currentCount() > 100) {
      errors.remove(errors.getRequiredLast());
    }

    console?.error(error);

    return {
      dispose: () => {
        errors.remove(error);
      },
    };
  }
}
