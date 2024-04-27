import { DomElement, DomElementClasses, DomText } from './element';
import { DomEngine } from './dom-engine';

class ManualDomElementClasses implements DomElementClasses {
  private readonly _classNames: string[];

  constructor(private element: HTMLElement) {
    const className = element.className;
    this._classNames = className === '' ? [] : className.split(' ');
  }

  public add(className: string): void {
    if (this._classNames.indexOf(className) < 0) {
      this._classNames.push(className);
      this.updateElementClass();
    }
  }

  public remove(className: string): void {
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
  constructor(private element: HTMLElement) {}

  public setInnerText(value: string) {
    this.element.innerText = value;
  }

  public setInnerHtml(value: string): void {
    this.element.innerHTML = value;
  }

  public appendChild(value: DomElement): void {
    this.element.appendChild((value as NativeElement).element);
  }

  public appendText(value: DomText): void {
    this.element.appendChild((value as DomNativeText).textNode);
  }

  public setAttribute(attribute: string, value: any): void {
    this.element.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.element.removeAttribute(attribute);
  }

  public setInnerElement(value: DomElement): void {
    this.appendChild(value);
  }

  public attachEventHandler(event: string, callback: () => void): any {
    this.element.addEventListener(event, callback);
    return callback;
  }

  public detachEventHandler(event: string, handler: any): void {
    this.element.removeEventListener(event, handler);
  }

  public remove(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public createClassNames(): DomElementClasses {
    return new ManualDomElementClasses(this.element);
  }

  public getValue(): string {
    return (this.element as HTMLInputElement).value;
  }

  public setValue(value: string): void {
    (this.element as HTMLInputElement).value = value;
  }

  public isChecked(): boolean {
    return (this.element as HTMLInputElement).checked;
  }

  public setChecked(value: boolean): void {
    (this.element as HTMLInputElement).checked = value;
  }
}

class DomNativeText implements DomText {
  constructor(public textNode: Text) {}

  public setText(value: string): void {
    this.textNode.nodeValue = value;
  }
}

export class NativeDomEngine implements DomEngine {
  public getRoot(): DomElement | null {
    return new NativeElement(document.body);
  }

  public createElement(tag: string): DomElement {
    return new NativeElement(document.createElement(tag));
  }

  public createNamespaceElement(namespace: string, tag: string): DomElement {
    return new NativeElement(
      document.createElementNS(namespace, tag) as HTMLElement
    ); // todo
  }

  public resolveElement(element: any): DomElement | null {
    if (typeof element === 'string') {
      const elementById = document.getElementById(element);
      if (elementById) {
        return new NativeElement(elementById);
      }
    }

    if (element.nodeType > 0) {
      return new NativeElement(element);
    }

    return null;
  }

  public createTextNode(text: string): DomText {
    return new DomNativeText(document.createTextNode(text));
  }
}
