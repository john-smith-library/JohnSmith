import {HtmlDefinition} from "./view-definition";

declare global {
    var JS: { d: (...args:any[]) => HtmlDefinition };
}