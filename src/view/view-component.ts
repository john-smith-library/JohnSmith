import { Disposable } from '../common';
import {DomElement} from "./element";
import {ViewRenderer} from "./view-renderer";
import {RenderingContext} from "./view-definition";

export interface ViewComponent<TData> {
    data?: TData;

    $$createBinding(parent: DomElement, renderer: ViewRenderer, renderingContext: RenderingContext): Disposable;
}
