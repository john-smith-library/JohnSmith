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
    console.log(arguments);

    const
        argsCount = arguments.length,
        nested = []//,
        //attributes: { [key: string]: any } = (argsCount > 1 ? arguments[1] : null) || {};
    ;

    //let text: string|null = null;

    for (let i = 2; i < argsCount; i++) {
        // const arg = arguments[i];
        //
        // if (arg.listen) {
        //     attributes['$innerText'] = arg;
        // } else if (typeof arg === 'string') {
        //     text = arg
        // } else {
            nested.push(arguments[i]);
        //}
    }

    return {
        element: arguments[0],
        attributes: argsCount > 1 ? arguments[1] : null,
        nested: nested//,
        //text: text
    };
}

(window as any)['JS'] = {
    d: domConstruct
};