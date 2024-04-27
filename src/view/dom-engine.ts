import { DomElement, DomText } from './element';

/**
 * Describes DOM operations.
 */
export interface DomEngine {
  /**
   * Method to create a DOM element with the specified tag.
   */
  createElement(tag: string): DomElement;

  /**
   * Method to create a DOM element within a specified namespace and tag
   * @param namespace namespace
   * @param tag element tag
   */
  createNamespaceElement(namespace: string, tag: string): DomElement;

  /**
   * Method to create a DOM text node with the specified text
   * @param text
   */
  createTextNode(text: string): DomText;

  /**
   * Method to resolve a DOM element from a given object.
   * Returns the corresponding DomElement if found, otherwise null.
   * @param element native element object or it's id
   */
  resolveElement(element: any): DomElement | null;

  /**
   * Method to get the root element of the DOM tree.
   * Returns the root DomElement if exists, otherwise null.
   */
  getRoot(): DomElement | null;
}
