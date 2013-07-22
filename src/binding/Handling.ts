/// <reference path="../Common.ts"/>
/// <reference path="BindableValue.ts"/>
/// <reference path="BindableList.ts"/>

module JohnSmith.Binding {
    export interface IValueToElementMapper {
        getElementFor(value:any, root:JohnSmith.Common.IElement):JohnSmith.Common.IElement;
        attachValueToElement(value:any, element:JohnSmith.Common.IElement);
    }

    export interface RenderHandlerOptions extends HandlerOptions {
        contentDestination?: JohnSmith.Common.IElement;
        renderer?: IValueRenderer;
        formatter?: IValueFormatter;
        valueType?: string;
        fetch?: string;
        view?: any;
        type?: string;
        to?: string;
        encode: bool;

        bidirectional?: bool;
        command?: any;
        commandContext?: any;
        event?: string;
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

    export interface IRenderedValue {
        element: Common.IElement;
        dispose?: () => void;
    }

    /**
     * Renders value to DOM element.
     */
    export interface IValueRenderer {
        render: (value: any, destination: JohnSmith.Common.IElement) => IRenderedValue;
        //dispose?: () => void;
    }

    export interface HandlerOptions {
        handler: string;
    }
}