/**
 * DomText is a wrapper around browser TextNode
 */

export interface DomText {
    setText(value: string): void;
}

export interface DomElementClasses {
    add(className: string): void;
    remove(className: string): void;
}

/**
 * DomElement is a wrapper around native browser HTMLElement
 */
export interface DomElement {
    setInnerText(value: string): void;

    setInnerElement(value: DomElement): void;

    appendChild(value: DomElement): void;

    appendText(value: DomText): void;

    setAttribute(attribute: string, value: any): void;

    removeAttribute(attribute: string): void;

    attachEventHandler(event: string, callback: () => void) : any;

    detachEventHandler(event: string, handler: any): void;

    remove(): void;

    createClassNames(): DomElementClasses;

    setInnerHtml(value: string): void;
}