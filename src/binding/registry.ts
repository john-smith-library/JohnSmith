import {Disposable} from "../common";
import {DomElement} from "../view";

export interface Binding
{
    (element: DomElement, args: any): Disposable;
}

export interface BindingRegistry {
    [key: string]: Binding;
}

export class DefaultBindingRegistry implements BindingRegistry {
    [key: string]: Binding;
}