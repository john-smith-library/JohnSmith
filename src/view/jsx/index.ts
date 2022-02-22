import {DefaultIntrinsicElements} from "./default-intrinsic-element";
import {HtmlDefinition} from '../view-definition';
import {ViewComponent} from "../view-component";
import '../../global';

declare global {
    namespace JSX {
        interface IElement extends DefaultIntrinsicElements{
            [elemName: string]: any;
        }

        interface IntrinsicElements  {
            [elemName: string]: IElement;
        }

        interface ElementAttributesProperty {
            data: {}; // specify the property name to use
        }

        interface ElementClass extends ViewComponent<any> {
        }

        // interface IntrinsicClassAttributes<T>  {
        //     viewModel?: any;
        //     listViewModel?: any;
        // }
        //
        // interface IntrinsicAttributes {
        //     viewModel?: any;
        //     listViewModel?: any;
        // }
    }

    //const JS: { d: (...args:any[]) => HtmlDefinition };
}

declare module '../../global' {
    interface JsGlobal {
        d: (...arguments: any[]) => HtmlDefinition
    }
}

JS.d = function(...args: any[]): HtmlDefinition {
    const
        argsCount = arguments.length,
        nested = [];

    for (let i = 2; i < argsCount; i++) {
        nested.push(args[i]);
    }

    const attributes = argsCount > 1 ? args[1] : null;
    const namespace: string|undefined = attributes ? attributes['xmlns'] : undefined;

    return {
        element: args[0],
        attributes: attributes,
        nested: nested,
        namespace: namespace
    };
};
