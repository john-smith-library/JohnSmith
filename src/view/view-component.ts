import { Disposable } from '../common';
import {DomElement} from "./element";
import {ViewRenderer} from "./view-renderer";

export interface ViewComponent<TData> {
    data?: TData;

    $$createBinding(parent: DomElement, renderer: ViewRenderer): Disposable;
}
