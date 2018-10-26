declare global {
    namespace JSX {
        interface IElement {
            $className?: any;
            "js-name"?: string;
            [elemName: string]: any;
        }

        interface IntrinsicElements {
            [elemName: string]: IElement;
        }
    }

    const JS: { d: () => HtmlDefinition };
}

//declare var JS: { d: () => HtmlDefinition };

import {HtmlDefinition} from "./dom/view";

function domConstruct(): HtmlDefinition{
    const
        argsCount = arguments.length,
        nested = [];

    for (let i = 2; i < argsCount - 1; i++) {
        nested.push(arguments[i]);
    }

    const
        lastIsText = typeof arguments[argsCount - 1] === 'string',
        text = lastIsText ? arguments[argsCount - 1] : null;

    if (!lastIsText) {
        nested.push(arguments[argsCount - 1]);
    }

    return {
        element: arguments[0],
        attributes: arguments[1],
        bindings: {},
        nested: nested,
        text: text
    };
}

(window as any)['JS'] = {
    d: domConstruct
};