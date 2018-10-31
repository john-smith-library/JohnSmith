import {DomElement, DomText} from "./element";
import {DomEngine} from "./dom-engine";

/**
 * DomElement based on DOM Core level 2 API
 */
class NativeElement implements DomElement {
    constructor(private element: HTMLElement){

    }

    setInnerText(value: string) {
        this.element.innerText = value;
    }

    appendChild(value: DomElement): void {
        this.element.appendChild((<NativeElement>value).element);
    }

    appendText(value: DomText): void {
        this.element.appendChild((<DomNativeText>value).textNode);
    }

    setAttribute(attribute: string, value: any): void {
        this.element.setAttribute(attribute, value);
    }

    setInnerElement(value: DomElement): void {
        this.appendChild(value);
    }

    attachEventHandler(event: string, callback: () => void): any {
        this.element.addEventListener(event, callback);
        return callback;
    }

    detachEventHandler(event: string, handler: any): void {
        this.element.removeEventListener(event, handler);
    }

    remove(): void {
        if(this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    addClass(className: string): void {
    }

    removeClass(className: string): void {
    }
}

class DomNativeText implements DomText {
    constructor(public textNode: Text){}

    setText(value: string): void {
        this.textNode.nodeValue = value;
    }
}

export class NativeDomEngine implements DomEngine {
    createElement(tag: string): DomElement {
        return new NativeElement(document.createElement(tag));
    }

    resolveElement(element: any): DomElement|null {
        if (typeof element === 'string') {
            const elementById = document.getElementById(element);
            if (elementById)
            {
                return new NativeElement(elementById);
            }
        }

        if (element.nodeType > 0) {
            return new NativeElement(element);
        }

        return null;
    }

    createTextNode(text: string): DomText {
        return new DomNativeText(document.createTextNode(text));
    }
}