import {DefaultIntrinsicElements} from "./default-intrinsic-element";
import {HtmlDefinition} from '../view-definition';
import {ViewComponent} from "../view-component";

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
