import {Troubleshooter} from "./troubleshooter";
import {DomElement} from "../view";
import {Disposable, NoopDisposable } from "../common";

export class NoopTroubleshooter implements Troubleshooter {
    bindingNotFound(code: string, context: DomElement): Disposable {
        return NoopDisposable;
    }
}