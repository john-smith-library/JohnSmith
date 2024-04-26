import { DomElement, DomText } from './element';

export interface DomEngine {
  createElement(tag: string): DomElement;

  createNamespaceElement(namespace: string, tag: string): DomElement;

  createTextNode(text: string): DomText;

  resolveElement(element: any): DomElement | null;

  getRoot(): DomElement | null;
}
