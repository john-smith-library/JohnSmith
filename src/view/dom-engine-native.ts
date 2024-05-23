import { DomElement, DomElementClasses, DomNode, DomText } from './element';
import { DomEngine } from './dom-engine';

abstract class NativeNode implements DomNode {
  protected constructor(public readonly element: Node) {}

  public abstract replaceWith(anotherNode: DomNode): void;

  public remove(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public abstract insertAfter(node: DomNode): void;
}

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

class NativeComment extends NativeNode {
  constructor(public readonly comment: Comment) {
    super(comment);
  }

  public replaceWith(anotherNode: DomNode): void {
    this.comment.replaceWith((anotherNode as NativeNode).element);
  }

  public insertAfter(node: DomNode): void {
    this.comment.after((node as NativeNode).element);
  }
}

/**
 * DomElement based on DOM Core level 2 API
 */
class NativeElement extends NativeNode implements DomElement {
  constructor(public readonly element: HTMLElement) {
    super(element);
  }

  public replaceWith(anotherNode: DomNode): void {
    this.element.replaceWith((anotherNode as NativeNode).element);
  }

  public insertAfter(node: DomNode): void {
    this.element.after((node as NativeNode).element);
  }

  public setInnerText(value: string) {
    this.element.innerText = value;
  }

  public setInnerHtml(value: string): void {
    this.element.innerHTML = value;
  }

  public appendChild(value: DomNode): void {
    this.element.appendChild((value as unknown as NativeNode).element);
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

class DomNativeText extends NativeNode implements DomText {
  constructor(public textNode: Text) {
    super(textNode);
  }

  public replaceWith(anotherNode: DomNode): void {
    this.textNode.replaceWith((anotherNode as NativeNode).element);
  }

  public setText(value: string): void {
    this.textNode.nodeValue = value;
  }

  public insertAfter(node: DomNode): void {
    this.textNode.after((node as NativeNode).element);
  }
}

export class NativeDomEngine implements DomEngine {
  public getRoot(): DomElement | null {
    return new NativeElement(document.body);
  }

  public createElement(tag: string): DomElement {
    return new NativeElement(document.createElement(tag));
  }

  public createMarkerElement(): DomNode {
    return new NativeComment(document.createComment('JS-placeholder'));
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
