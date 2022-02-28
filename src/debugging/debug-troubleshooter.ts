import {Troubleshooter} from "../troubleshooting/troubleshooter";
import {DomElement, DomElementClasses} from "../view";
import {Disposable} from "../common";
import {ErrorsViewModel} from "./errors-view-model";

export class ErrorInfo {
    private classNames: DomElementClasses;

    constructor(
        public readonly element: DomElement,
        public readonly message: string,
        public readonly index: number
    ) {
        this.classNames = this.element.createClassNames()
    }

    highlightErrorElement() {
        this.classNames.add('js-debugger-error');
    }

    unHighlightErrorElement() {
        this.classNames.remove('js-debugger-error');
    }
}

export class DebugTroubleshooter implements Troubleshooter {
    private _firstError = true;
    private _errorIndex = 1;

    constructor(
        private debuggerViewModel: ErrorsViewModel,
        private onFirstErrorCallback: () => void) {
    }

    bindingNotFound(code: string, context: DomElement): Disposable {
        return this.pushErrorMessage(
            'Binding with code [' + code + '] is not registered, please make sure the code is correct and the binding definition has been imported',
            context
        );
    }

    private pushErrorMessage(message: string, target: DomElement): Disposable {
        if (this._firstError) {
            this.onFirstErrorCallback();
            this._firstError = false;
        }

        const errors = this.debuggerViewModel.errors;
        const error = new ErrorInfo(
            target,
            message,
            this._errorIndex++);

        errors.add(error);
        while (errors.currentCount() > 100) {
            errors.remove(errors.getRequiredLast());
        }

        console?.error(error);

        return {
            dispose: () => {
                errors.remove(error);
            }
        }
    }
}