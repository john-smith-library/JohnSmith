export interface DomNode {
  remove(): void;

  replaceWith(anotherNode: DomNode): void;

  insertAfter(node: DomNode): void;

  insertBefore(node: DomNode): void;

  readonly isMarker?: true;
}

export interface DomMarker extends DomNode {
  readonly isMarker: true;
}

/**
 * DomText is a wrapper around browser TextNode
 */
export interface DomText extends DomNode {
  setText(value: string): void;
}

export interface DomElementClasses {
  add(className: string): void;
  remove(className: string): void;
}

/**
 * DomElement is a wrapper around native browser HTMLElement
 */
export interface DomElement extends DomNode {
  setInnerText(value: string): void;

  setInnerElement(value: DomElement): void;

  appendChild(value: DomNode): void;

  setAttribute(attribute: string, value: any): void;

  removeAttribute(attribute: string): void;

  attachEventHandler(event: string, callback: () => void): any;

  detachEventHandler(event: string, handler: any): void;

  createClassNames(): DomElementClasses;

  setInnerHtml(value: string): void;

  getValue(): string;

  setValue(value: string): void;

  isChecked(): boolean;

  setChecked(value: boolean): void;
}
