import {JS_VERSION} from "./version";

export class JsGlobal {
    constructor(
        public readonly version: string) {
    }
}

declare global {
    var JS: JsGlobal;
}

globalThis.JS = new JsGlobal(JS_VERSION);
