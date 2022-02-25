import {JS_VERSION} from "./version";

export class JsGlobal {
    constructor(
        public readonly version: string) {
    }
}

declare global {
    // eslint-disable-next-line no-var
    var JS: JsGlobal; // we have to use var here according to the syntax
}

globalThis.JS = new JsGlobal(JS_VERSION);
