import {Disposable} from "../common";
import {DomElement} from "../view";

export interface Troubleshooter {
    bindingNotFound(code: string, context: DomElement): Disposable;
}