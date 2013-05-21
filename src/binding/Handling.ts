module JohnSmith.Binding {
    // Converts a value to string representation.
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