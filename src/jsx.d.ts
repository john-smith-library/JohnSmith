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
    const JS: {
        d: () => HtmlDefinition;
    };
}
import { HtmlDefinition } from "./dom/view";
