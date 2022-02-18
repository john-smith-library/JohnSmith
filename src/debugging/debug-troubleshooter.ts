import {Troubleshooter} from "../troubleshooting/troubleshooter";
import {DomElement} from "../view";
import {Disposable} from "../common";
import {ErrorsViewModel} from "./errors-view-model";

export class ErrorInfo {
    constructor(
        public readonly element: DomElement,
        public readonly message: string
    ) {
    }
}

export class DebugTroubleshooter implements Troubleshooter {
    private _firstError = true;

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

        const error = new ErrorInfo(target, message);

        this.debuggerViewModel.errors.add(error);

        console?.error(error);

        return {
            dispose: () => {
                this.debuggerViewModel.errors.remove(error);
            }
        }
    }
}