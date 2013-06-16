/// <reference path="../Common.ts"/>
/// <reference path="BindableValue.ts"/>
/// <reference path="BindableList.ts"/>

module JohnSmith.Binding {
//    /** Represents string value information */
//    export interface IFormattedValue {
//        value: string;
//        type: string;
//    }

    export interface IValueToElementMapper {
        getElementFor(value:any, root:JohnSmith.Common.IElement):JohnSmith.Common.IElement;
        attachValueToElement(value:any, element:JohnSmith.Common.IElement);
    }

    export interface RenderHandlerOptions extends HandlerOptions {
        contentDestination?: JohnSmith.Common.IElement;
        renderer?: IValueRenderer;
        formatter?: IValueFormatter;
        valueType?: string;
        view?: any;
        type?: string;
        to?: string;
        encode: bool;
    }

    export interface RenderListOptions extends RenderHandlerOptions {
        mapper?: IValueToElementMapper;
        selectable?: bool;
        selectedItem: BindableValue;
        setSelection: (value: any) => void;
    }

    export interface SelectionOptions {
        isSelectable: bool;
        selectedItem: IBindable;
        setSelectedCallback: (selectedItem: any) => void;
    }

    /**
     * Converts a value to string representation.
     */
    export interface IValueFormatter {
        format: (value: any) => string;
        dispose?: () => void;
    }

    // Renders value to DOM element.
    export interface IValueRenderer {
        render: (value: any, destination: JohnSmith.Common.IElement) => JohnSmith.Common.IElement;
        dispose?: () => void;
    }

    export interface HandlerOptions {
        handler: string;
    }
}