/**
 * Represents something that could be disposed.
 */
export interface IDisposable {
    dispose(): void;
}

/**
 * Represents something that could be initialized.
 */
export interface IInitializable {
    init(): void;
}

/**
 * Represents an object that has a particular lifecycle.
 * It could be initialized once it goes to stage and disposed when it is no longer needed.
 */
export interface IManageable extends IDisposable, IInitializable {
}

/**
 * Someone who can manage.
 */
export interface IManager extends IDisposable {
    manage(manageable:IManageable):void;
}

/**
 * Wrapper around HTML element
 */
export interface IElement {
    $: any;
    empty: () => void;
    appendHtml: (html:string) => IElement;
    findRelative: (query:string) => IElement;
    remove: () => void;
    getNodeName: () => string;

    addClass: (className: string) => void;
    removeClass: (className: string) => void;

    setHtml(html:string);
    setText(text: string);

    getValue: () => string;
    setValue(value: string);

    getAttribute(attribute: string);
    setAttribute(attribute: string, value: string);

    getProperty(property: string):any;
    setProperty(property: string, value: any);

    attachEventHandler(event: string, callback: (target:IElement) => void) : any;
    detachEventHandler(event: string, handler: any);
}

/**
 * Describes the type of string value
 */
export module ValueType {
    /** The value contains plain text */
    export var text = "text";

    /** The value contains prepared html */
    export var html = "html";

    /** The value contains an object that could be transformed to html */
    export var unknown = "unknown";
}

export interface IMarkupResolver {
    /**
     * Resolves markup object and returns valid html string.
     * @param markup
     */
    resolve(markup: any): string;
}