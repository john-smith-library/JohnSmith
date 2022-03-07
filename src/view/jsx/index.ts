import {DefaultIntrinsicElements} from "./default-intrinsic-element";
import {
    HtmlDefinition,
    HtmlDefinitionAttributes,
    HtmlDefinitionElement,
    NestedHtmlDefinition
} from "../view-definition";
import {ViewComponent} from "../view-component";
import '../../global';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IElement extends DefaultIntrinsicElements{
            [elemName: string]: any;
        }

        interface IntrinsicElements  {
            [elemName: string]: IElement;
        }

        interface ElementAttributesProperty {
            data: unknown; // specify the property name to use
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ElementClass extends ViewComponent<unknown> {
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

export type DArguments = [
    HtmlDefinitionElement,
    HtmlDefinitionAttributes,
    ...NestedHtmlDefinition] | [HtmlDefinitionElement];

declare module '../../global' {
    interface JsGlobal {
        d: (...arguments: DArguments) => HtmlDefinition
    }
}

JS.d = function(...args: DArguments): HtmlDefinition {
    const
        argsCount = arguments.length,
        nested = [];

    for (let i = 2; i < argsCount; i++) {
        nested.push(args[i]);
    }

    /* Note: ts compiler does not recognize "argsCount > 1" as a guard so we have
    *  to do this ugly cast here */
    const attributes = <HtmlDefinitionAttributes|null>(argsCount > 1 ? args[1] : null);

    const namespace: string|undefined = attributes ? attributes['xmlns'] : undefined;

    return {
        element: args[0],
        attributes: attributes,
        nested: nested,
        namespace: namespace
    };
};
