import { Disposable } from '../common';
import {DomElement} from "./element";
import {ViewRenderer} from "./view-renderer";

export type ViewComponentConstructor<T> = { new(data: T): ViewComponent<T> }

export interface ViewComponent<TData> {
    data?: TData;

    $$createBinding(parent: DomElement, renderer: ViewRenderer): Disposable;
}
