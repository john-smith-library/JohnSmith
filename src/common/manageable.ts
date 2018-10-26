import {Disposable} from "./disposable";

export interface Manageable extends Disposable {
    init(): void;
}