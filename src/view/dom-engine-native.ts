import {DomElement, DomElementClasses, DomText} from "./element";
import {DomEngine} from "./dom-engine";

class ManualDomElementClasses implements DomElementClasses {
    private readonly _classNames:string[];

    constructor(private element: HTMLElement){
        const className = element.className;
        this._classNames = className === '' ? [] : className.split(' ');
    }

    add(className: string): void {
        if (this._classNames.indexOf(className) < 0) {
            this._classNames.push(className);
            this.updateElementClass();
        }
    }

    remove(className: string): void {
        const index = this._classNames.indexOf(className);
        if (index >= 0) {
            this._classNames.splice(index, 1);
            this.updateElementClass();
        }
    }

    private updateElementClass() {
        this.element.className = this._classNames.join(' ');
    }
}

/**
 * DomElement based on DOM Core level 2 API
 */
class NativeElement implements DomElement {
    constructor(private element: HTMLElement){

    }

    setInnerText(value: string) {
        this.element.innerText = value;
    }

    setInnerHtml(value: string): void {
        this.element.innerHTML = value;
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

    removeAttribute(attribute: string): void {
        this.element.removeAttribute(attribute);
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

    createClassNames(): DomElementClasses {
        return new ManualDomElementClasses(this.element);
    }

    getValue(): string {
        return (<HTMLInputElement>this.element).value;
    }

    setValue(value: string): void {
        (<HTMLInputElement>this.element).value = value;
    }

    isChecked(): boolean {
        return (<HTMLInputElement>this.element).checked;
    }

    setChecked(value: boolean): void {
        (<HTMLInputElement>this.element).checked = value;
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