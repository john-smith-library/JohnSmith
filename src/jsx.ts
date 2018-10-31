import {DefaultIntrinsicElements} from "./default-intristic-element";

declare global {
    namespace JSX {
        interface IElement extends DefaultIntrinsicElements{
            $className?: any;
            "js-name"?: string;
            [elemName: string]: any;
        }

        interface IntrinsicElements  {
            [elemName: string]: IElement;
        }
    }

    const JS: { d: () => HtmlDefinition };
}

import { HtmlDefinition } from "./dom/view";

function domConstruct(): HtmlDefinition {
    const
        argsCount = arguments.length,
        nested = [];

    for (let i = 2; i < argsCount; i++) {
        nested.push(arguments[i]);
    }

    return {
        element: arguments[0],
        attributes: argsCount > 1 ? arguments[1] : null,
        nested: nested
    };
}

(window as any)['JS'] = {
    d: domConstruct
};