import {DefaultIntrinsicElements} from "./default-intrinsic-element";
import {HtmlDefinition} from '../view-definition';

declare global {
    namespace JSX {
        interface IElement extends DefaultIntrinsicElements{
            [elemName: string]: any;
        }

        interface IntrinsicElements  {
            [elemName: string]: IElement;
        }

        interface IntrinsicClassAttributes<T>  {
            viewModel?: any;
            listViewModel?: any;
        }

        interface IntrinsicAttributes {
            viewModel?: any;
            listViewModel?: any;
        }
    }

    const JS: { d: () => HtmlDefinition };
}