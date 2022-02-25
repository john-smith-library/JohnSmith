import {Troubleshooter} from "./troubleshooter";
import {Disposable, NoopDisposable } from "../common";

export class NoopTroubleshooter implements Troubleshooter {
    bindingNotFound(): Disposable {
        return NoopDisposable;
    }
}