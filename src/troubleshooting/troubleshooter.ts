import {Disposable} from "../common";
import {DomElement, HtmlDefinition} from "../view";

export interface Troubleshooter {
    bindingNotFound(code: string, context: DomElement): Disposable;

    elementNotFound(element: HTMLElement|string, context: DomElement|null): Disposable;

    unknownHtmlDefinition(source: HtmlDefinition, context: DomElement): Disposable;
}