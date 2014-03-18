/// <reference path="../Common.ts"/>
/// <reference path="BindableValue.ts"/>
/// <reference path="BindableList.ts"/>

module JohnSmith.Binding {
    export interface RenderHandlerOptions extends HandlerOptions {
        contentDestination?: JohnSmith.Common.IElement;
        renderer?: IValueRenderer;
        formatter?: IValueFormatter;
        valueType?: string;
        fetch?: string;
        view?: any;
        type?: string;
        to?: string;
        encode: boolean;

        bidirectional?: boolean;
        command?: any;
        commandContext?: any;
        event?: string;
    }

    export interface RenderListOptions extends RenderHandlerOptions {
        selectable?: boolean;
        selectedItem: BindableValue;
        setSelection: (value: any) => void;
    }

    export interface SelectionOptions {
        isSelectable: boolean;
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
        dispose: () => void;
    }

    /**
     * Renders value to DOM element.
     */
    export interface IValueRenderer {
        render: (value: any, destination: JohnSmith.Common.IElement) => IRenderedValue;
    }

    export interface HandlerOptions {
        handler: string;
    }
}